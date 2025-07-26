import { db } from '@/database';
import { ThreadMessage, ToolKeys } from '@/ai/types';
import * as queries from '@/database/queries';
import { ThreadError } from '@/ai/error';
import { convertToModelMessages, generateText } from 'ai';
import { createResumableStreamContext } from 'resumable-stream';
import { UserId } from '@/database/types';
import { FreeLimits, ProLimits } from '@/lib/constants';
import { match } from 'ts-pattern';
import type { model, usage, userCustomer } from '@/database/schema';

export const streamContext = createResumableStreamContext({
    waitUntil: promise => promise,
});

export async function prepareThread(args: {
    isAnonymous: boolean;
    userId: string;
    threadId: string;
    streamId: string;
    modelId: string;
    message: ThreadMessage;
    tool?: string;
}) {
    return db.transaction(async tx => {
        let [thread, message, model, settings, usage, customer] = await Promise.all([
            queries.getThreadById(tx, args.threadId),
            queries.getMessageById(tx, args.message.id),
            queries.getModelById(tx, args.modelId),
            queries.getSettingsByUserId(tx, args.userId),
            queries.getUsageByUserId(tx, UserId(args.userId)),
            queries.getUserCustomerByUserId(tx, UserId(args.userId)),
        ]);

        if (!settings) {
            throw new ThreadError('SettingsNotFound', {
                status: 404,
                message: 'Settings for user (userId) does not exist',
                metadata: {
                    userId: args.userId,
                },
            });
        }

        if (!usage) {
            throw new ThreadError('UsageNotFound', {
                status: 404,
                message: 'Usage for user (userId) does not exist',
                metadata: {
                    userId: args.userId,
                },
            });
        }

        if (!model) {
            throw new ThreadError('ModelNotFound', {
                status: 404,
                message: 'Model with (modelId) does not exist',
                metadata: {
                    modelId: args.modelId,
                },
            });
        }

        // Check user access permissions
        // const accessCheck = checkUserAccess({
        //     usage,
        //     model,
        //     customer,
        //     isAnonymous: args.isAnonymous,
        //     tool: args.tool,
        // });

        // if (!accessCheck.canSendMessage) {
        //     // Determine specific error reason
        //     if (!accessCheck.canUseModel && !accessCheck.hasEnoughCredits) {
        //         throw new ThreadError('NotAllowed', {
        //             status: 403,
        //             message: 'User does not have enough credits to use this model',
        //             metadata: {
        //                 userId: args.userId,
        //                 modelId: args.modelId,
        //                 modelCost: accessCheck.modelCost,
        //                 remainingCredits: accessCheck.remainingCredits,
        //             },
        //         });
        //     }

        //     if (!accessCheck.canUseModel && args.isAnonymous && model.access !== 'public') {
        //         throw new ThreadError('NotAllowed', {
        //             status: 403,
        //             message: 'Anonymous users cannot use this model',
        //             metadata: {
        //                 userId: args.userId,
        //                 modelId: args.modelId,
        //                 modelAccess: model.access,
        //             },
        //         });
        //     }

        //     if (
        //         !accessCheck.canUseModel &&
        //         !accessCheck.isPro &&
        //         model.access === 'premium_required'
        //     ) {
        //         throw new ThreadError('NotAllowed', {
        //             status: 403,
        //             message: 'Premium subscription required to use this model',
        //             metadata: {
        //                 userId: args.userId,
        //                 modelId: args.modelId,
        //                 modelAccess: model.access,
        //             },
        //         });
        //     }

        //     if (args.tool === 'search' && !accessCheck.canSearch) {
        //         throw new ThreadError('NotAllowed', {
        //             status: 403,
        //             message: 'User has exceeded search limit',
        //             metadata: {
        //                 userId: args.userId,
        //                 remainingSearches: accessCheck.remainingSearches,
        //             },
        //         });
        //     }

        //     if (args.tool === 'research' && !accessCheck.canResearch) {
        //         throw new ThreadError('NotAllowed', {
        //             status: 403,
        //             message: 'User has exceeded research limit',
        //             metadata: {
        //                 userId: args.userId,
        //                 remainingResearches: accessCheck.remainingResearches,
        //             },
        //         });
        //     }

        //     if (args.tool === 'research' && args.isAnonymous) {
        //         throw new ThreadError('NotAllowed', {
        //             status: 403,
        //             message: 'Anonymous users are not allowed to use the research tool',
        //             metadata: {
        //                 userId: args.userId,
        //             },
        //         });
        //     }

        //     // Fallback error
        //     throw new ThreadError('NotAllowed', {
        //         status: 403,
        //         message: 'User is not allowed to send this message',
        //         metadata: {
        //             userId: args.userId,
        //             modelId: args.modelId,
        //             tool: args.tool,
        //         },
        //     });
        // }

        if (!thread) {
            [thread] = await queries.createThread(tx, {
                userId: args.userId,
                threadId: args.threadId,
            });
        }

        if (thread.status === 'streaming') {
            throw new ThreadError('ThreadAlreadyStreaming', {
                metadata: {
                    threadId: args.threadId,
                },
            });
        }

        if (thread.userId !== args.userId) {
            throw new ThreadError('NotAuthorized', {
                message: 'User is not the owner of the thread',
                metadata: {
                    threadId: args.threadId,
                },
            });
        }

        await queries.updateThread(tx, {
            threadId: args.threadId,
            status: 'streaming',
            streamId: args.streamId,
            updatedAt: new Date(),
        });

        if (!message) {
            [message] = await queries.createMessage(tx, {
                threadId: args.threadId,
                userId: args.userId,
                message: args.message,
            });
        }

        if (message) {
            [[message]] = await Promise.all([
                queries.updateMessage(tx, {
                    messageId: args.message.id,
                    message: args.message,
                    updatedAt: new Date(),
                }),
                queries.deleteTrailingMessages(tx, {
                    threadId: args.threadId,
                    messageId: args.message.id,
                    messageCreatedAt: message.createdAt,
                }),
            ]);
        }

        const history = await queries.getThreadMessageHistory(tx, args.threadId);

        return {
            model,
            thread,
            message,
            history,
            settings,
        };
    });
}

export async function prepareResumeThread(args: { threadId: string; userId: string }) {
    const thread = await queries.getThreadById(db, args.threadId);

    if (!thread) {
        throw new ThreadError('ThreadNotFound', {
            status: 404,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    if (thread.userId !== args.userId) {
        throw new ThreadError('NotAuthorized', {
            status: 403,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    if (!thread.streamId) {
        throw new ThreadError('StreamNotFound', {
            status: 404,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    return thread.streamId;
}

export async function generateThreadTitle(threadId: string, message: ThreadMessage) {
    const { text } = await generateText({
        model: 'google/gemini-2.0-flash-001',
        system: `\nc
        - you will generate a short title based on the first message a user begins a conversation with
        - ensure it is not more than 80 characters long
        - the title should be a summary of the user's message
        - do not use quotes or colons`,
        temperature: 0.8,
        messages: convertToModelMessages([message]),
    });

    await queries.updateThreadTitle(db, {
        threadId,
        title: text,
    });
}

export async function saveMessageAndResetThreadStatus({
    threadId,
    userId,
    message,
}: {
    threadId: string;
    userId: string;
    message: ThreadMessage;
}) {
    await db.transaction(async tx => {
        await Promise.all([
            await queries.createMessage(tx, {
                threadId,
                userId,
                message,
            }),
            await queries.updateThread(tx, {
                threadId,
                status: 'ready',
                streamId: null,
            }),
        ]);
    });
}

export type CheckUserAccessArgs = {
    usage: typeof usage.$inferSelect;
    model: typeof model.$inferSelect;
    customer: typeof userCustomer.$inferSelect | null | undefined;
    isAnonymous: boolean;
    tool?: string;
};

export type CheckUserAccessResult = {
    isPro: boolean;
    remainingCredits: number;
    remainingSearches: number;
    remainingResearches: number;
    canUseModel: boolean;
    canSearch: boolean;
    canResearch: boolean;
    canSendMessage: boolean;
    modelCost: number;
    hasEnoughCredits: boolean;
};

export function checkUserAccess(args: CheckUserAccessArgs): CheckUserAccessResult {
    const { usage, model, customer, isAnonymous, tool } = args;

    // Check if user is pro based on subscription
    const isPro = customer?.subscription?.currentPeriodEnd
        ? customer.subscription.currentPeriodEnd > Date.now() / 1000
        : false;

    // Calculate remaining limits
    const remainingCredits = isPro
        ? ProLimits.CREDITS - (usage.credits || 0)
        : FreeLimits.CREDITS - (usage.credits || 0);

    const remainingSearches = isPro
        ? ProLimits.SEARCH - (usage.search || 0)
        : FreeLimits.SEARCH - (usage.search || 0);

    const remainingResearches = isPro
        ? ProLimits.RESEARCH - (usage.research || 0)
        : FreeLimits.RESEARCH - (usage.research || 0);

    // Check if user can use the model
    const modelCost = model.credits || 0;
    const hasEnoughCredits = remainingCredits - modelCost >= 0;

    const canUseModel = match({
        hasEnoughCredits,
        isAnonymous,
        isPro,
        access: model.access,
    })
        .with(
            {
                access: 'public',
                hasEnoughCredits: true,
            },
            () => true
        )
        .with(
            {
                access: 'account_required',
                isAnonymous: false,
                hasEnoughCredits: true,
            },
            () => true
        )
        .with(
            {
                access: 'premium_required',
                isAnonymous: false,
                isPro: true,
                hasEnoughCredits: true,
            },
            () => true
        )
        .otherwise(() => false);

    const canSearch = remainingSearches > 0;
    const canResearch = remainingResearches > 0;

    const canSendMessage = (() => {
        if (!canUseModel) return false;

        if (tool === 'search' && !canSearch) return false;
        if (tool === 'research' && !canResearch) return false;
        if (tool === 'research' && isAnonymous) return false;

        return true;
    })();

    return {
        isPro,
        remainingCredits,
        remainingSearches,
        remainingResearches,
        canUseModel,
        canSearch,
        canResearch,
        canSendMessage,
        modelCost,
        hasEnoughCredits,
    };
}
