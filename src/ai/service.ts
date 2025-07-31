import { db, schema } from '@/database';
import { ThreadMessage } from '@/ai/types';
import * as queries from '@/database/queries';
import * as queriesV2 from '@/database/queries.v2';
import { ThreadError } from '@/ai/error';
import { convertToModelMessages, generateText } from 'ai';
import { createResumableStreamContext } from 'resumable-stream';
import { UserId } from '@/database/types';
import { Database } from '@/database/effect';
import { Duration, Effect, Schedule } from 'effect';
import { APIError } from '@/lib/error';
import { AnonymousLimits, FreeLimits, ProLimits } from '@/lib/constants';
import { match } from 'ts-pattern';

export const streamContext = createResumableStreamContext({
    waitUntil: promise => promise,
});

export function prepareThreadContext(args: {
    isAnonymous: boolean;
    userId: UserId;
    threadId: string;
    streamId: string;
    modelId: string;
    message: ThreadMessage;
}) {
    const effects = Effect.all(
        [
            queriesV2.getThreadById(args.threadId),
            queriesV2.getMessageById(args.message.id),
            queriesV2.getModelById(args.modelId),
            queriesV2.getSettingsByUserId(args.userId),
            queriesV2.getUsageByUserId(args.userId),
            queriesV2.getUserCustomerByUserId(args.userId),
        ],
        {
            concurrency: 'unbounded',
        }
    );

    const effect = Effect.gen(function* () {
        yield* Effect.logInfo('Preparing thread context');
        let [thread, message, model, settings, usage, customer] = yield* effects;

        if (!settings) {
            return yield* new APIError({
                status: 404,
                message: 'Settings for user (userId) does not exist',
            });
        }

        if (!usage) {
            return yield* new APIError({
                status: 404,
                message: 'Usage for user (userId) does not exist',
            });
        }

        if (!model) {
            return yield* new APIError({
                status: 404,
                message: 'Model with (modelId) does not exist',
            });
        }

        if (!thread) {
            yield* Effect.logInfo('Creating thread');
            [thread] = yield* queriesV2.createThread({
                id: args.threadId,
                userId: args.userId,
            });
        }

        if (thread.status === 'streaming') {
            return yield* new APIError({
                status: 400,
                message: 'Thread is already streaming',
            });
        }

        if (thread.userId !== args.userId) {
            return yield* new APIError({
                status: 403,
                message: 'User is not the owner of the thread',
            });
        }

        const limits = getLimits({
            customer,
            isAnonymous: args.isAnonymous,
        });

        if (limits.CREDITS - (usage.credits || 0) - model.credits < 0) {
            return yield* new APIError({
                status: 403,
                message: 'You have reached your credit limit.',
            });
        }

        yield* Effect.logInfo('Update thread status to streaming');
        yield* queriesV2.updateThread({
            threadId: args.threadId,
            status: 'streaming',
            streamId: args.streamId,
            updatedAt: new Date(),
        });

        if (message) {
            yield* Effect.logInfo('Updating message and deleting trailing messages');
            [[message]] = yield* Effect.all(
                [
                    queriesV2.updateMessage({
                        messageId: args.message.id,
                        message: args.message,
                        updatedAt: new Date(),
                    }),
                    queriesV2.deleteTrailingMessages({
                        threadId: args.threadId,
                        messageId: args.message.id,
                        messageCreatedAt: message.createdAt,
                    }),
                ],
                {
                    concurrency: 'unbounded',
                }
            );
        }

        if (!message) {
            yield* Effect.logInfo('Creating message');
            [message] = yield* queriesV2.createMessage({
                threadId: args.threadId,
                userId: args.userId,
                message: args.message,
            });
        }

        const history = yield* queriesV2.getThreadMessageHistory(args.threadId);

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

    return Database.transaction(effect).pipe(
        APIError.map({
            status: 500,
            message: 'Failed to prepare thread context',
        })
    );
}

export function convertUIMessagesToModelMessages(
    messages: ThreadMessage[],
    options: {
        supportsImages?: boolean;
        supportsDocuments?: boolean;
    } = {
        supportsImages: false,
        supportsDocuments: false,
    }
) {
    return Effect.tryPromise(async () => {
        return convertToModelMessages(
            await Promise.all(
                messages.map(async message => {
                    message.parts = message.parts.filter(part => {
                        if (part.type === 'file') {
                            if (
                                (part.mediaType.startsWith('application/pdf') ||
                                    part.mediaType.startsWith('text/plain')) &&
                                !options.supportsDocuments
                            ) {
                                return false;
                            }
                            if (part.mediaType.startsWith('image/') && !options.supportsImages) {
                                return false;
                            }
                        }
                        return true;
                    });

                    for (const part of message.parts) {
                        if (part.type === 'file') {
                            if (
                                part.mediaType.startsWith('application/pdf') ||
                                part.mediaType.startsWith('text/plain')
                            ) {
                                // @ts-expect-error - TODO: fix this
                                part.url = await fetch(part.url)
                                    .then(res => res.blob())
                                    .then(blob => blob.arrayBuffer());
                            }
                        }
                    }

                    return message;
                })
            )
        );
    });
}

export function createResumableStream(streamId: string, stream: ReadableStream<string>) {
    return Effect.tryPromise(async () => {
        return streamContext.createNewResumableStream(streamId, () => stream);
    }).pipe(
        Effect.retry(
            Schedule.exponential(Duration.millis(200)).pipe(Schedule.compose(Schedule.recurs(3)))
        )
    );
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

export function saveMessageAndResetThreadStatus(args: {
    threadId: string;
    userId: string;
    message: ThreadMessage;
}) {
    return Database.transaction(
        Effect.gen(function* () {
            yield* Effect.logInfo('Saving message and resetting thread status');
            yield* Effect.all(
                [
                    queriesV2.createMessage({
                        threadId: args.threadId,
                        userId: args.userId,
                        message: args.message,
                    }),
                    queriesV2.updateThread({
                        threadId: args.threadId,
                        status: 'ready',
                        streamId: null,
                    }),
                ],
                {
                    concurrency: 'unbounded',
                }
            );
        })
    );
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

export function getLimits(args: {
    customer?: typeof schema.userCustomer.$inferSelect;
    isAnonymous: boolean;
}) {
    return match({
        isPro:
            Number(args.customer?.subscription?.currentPeriodEnd ?? 0) >
            new Date().getTime() / 1000,
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
}
