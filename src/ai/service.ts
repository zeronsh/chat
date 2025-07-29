import { db } from '@/database';
import { ThreadMessage, ToolKeys } from '@/ai/types';
import * as queries from '@/database/queries';
import { ThreadError } from '@/ai/error';
import { convertToModelMessages, generateText } from 'ai';
import { createResumableStreamContext } from 'resumable-stream';
import { UserId } from '@/database/types';
import { AnonymousLimits, FreeLimits, ProLimits } from '@/lib/constants';
import { match } from 'ts-pattern';

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

        const limits = match({
            isPro:
                Number(customer?.subscription?.currentPeriodEnd ?? 0) > new Date().getTime() / 1000,
            isAnonymous: args.isAnonymous,
        })
            .with(
                {
                    isPro: true,
                    isAnonymous: false,
                },
                () => ProLimits
            )
            .with(
                {
                    isPro: false,
                    isAnonymous: false,
                },
                () => FreeLimits
            )
            .with(
                {
                    isPro: false,
                    isAnonymous: true,
                },
                () => AnonymousLimits
            )
            .otherwise(() => AnonymousLimits);

        if (limits.CREDITS - (usage.credits || 0) - model.credits < 0) {
            throw new ThreadError('NotAllowed', {
                status: 403,
                message: 'You have reached your credit limit.',
                metadata: {
                    userId: args.userId,
                    limits,
                    usage,
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
            usage,
            limits,
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
    try {
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

        await db.transaction(async tx => {
            await queries.updateThreadTitle(tx, {
                threadId,
                title: text,
            });
        });
    } catch (error) {
        console.error(error);
    }
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

export async function incrementUsage(
    userId: UserId,
    type: 'search' | 'research' | 'credits',
    amount: number
) {
    await queries.incrementUsage(
        db,
        {
            userId,
            type,
        },
        amount
    );
}

export async function decrementUsage(
    userId: UserId,
    type: 'search' | 'research' | 'credits',
    amount: number
) {
    await queries.decrementUsage(
        db,
        {
            userId,
            type,
        },
        amount
    );
}
