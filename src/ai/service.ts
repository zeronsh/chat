import { db, schema } from '@/database';
import { ThreadMessage } from '@/ai/types';
import * as queries from '@/database/queries';
import * as queriesV2 from '@/database/queries.v2';
import {
    convertToModelMessages,
    createUIMessageStream,
    generateText,
    JsonToSseTransformStream,
} from 'ai';
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
            history,
            settings,
            usage,
            limits,
            thread,
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
        Effect.tapError(error => Effect.logError('Error creating resumable stream', error)),
        Effect.retry(
            Schedule.exponential(Duration.millis(200)).pipe(Schedule.compose(Schedule.recurs(3)))
        ),
        Effect.catchAll(() => Effect.succeed(stream))
    );
}

export function getResumableStream(streamId: string) {
    return Effect.gen(function* () {
        const emptyDataStream = createUIMessageStream({
            execute: () => {},
        });
        return yield* Effect.tryPromise(async () => {
            return streamContext.resumableStream(streamId, () =>
                emptyDataStream.pipeThrough(new JsonToSseTransformStream())
            );
        }).pipe(
            Effect.tapError(error => Effect.logError('Error getting resumable stream', error)),
            Effect.retry(
                Schedule.exponential(Duration.millis(200)).pipe(
                    Schedule.compose(Schedule.recurs(3))
                )
            ),
            Effect.catchAll(() => Effect.succeed(null))
        );
    });
}

export function prepareResumeThreadContext(args: { threadId: string; userId: string }) {
    return Effect.gen(function* () {
        const thread = yield* queriesV2.getThreadById(args.threadId);

        if (!thread) {
            return yield* new APIError({
                status: 404,
                message: 'Thread not found',
            });
        }

        if (thread.userId !== args.userId) {
            return yield* new APIError({
                status: 403,
                message: 'User is not the owner of the thread',
            });
        }

        if (thread.status !== 'streaming') {
            return yield* new APIError({
                status: 400,
                message: 'Thread is not streaming',
            });
        }

        if (!thread.streamId) {
            return yield* new APIError({
                status: 404,
                message: 'Thread is not streaming',
            });
        }

        return thread.streamId;
    });
}

export function generateThreadTitle(threadId: string, message: ThreadMessage, latch: Effect.Latch) {
    return Effect.gen(function* () {
        yield* latch.close;
        yield* Effect.logInfo('Generating thread title');

        const { text } = yield* Effect.tryPromise(() =>
            generateText({
                model: 'google/gemini-2.0-flash-001',
                system: `\nc
                - you will generate a short title based on the first message a user begins a conversation with
                - ensure it is not more than 80 characters long
                - the title should be a summary of the user's message
                - do not use quotes or colons`,
                temperature: 0.8,
                messages: convertToModelMessages([message]),
            })
        ).pipe(
            Effect.tapError(error => Effect.logError('Error generating thread title', error)),
            Effect.catchAll(() => Effect.succeed({ text: '' }))
        );

        yield* queriesV2
            .updateThreadTitle({
                threadId,
                title: text,
            })
            .pipe(
                Effect.tapError(error => Effect.logError('Error updating thread title', error)),
                Effect.catchAll(() => Effect.succeed(null))
            );

        yield* latch.open;
    });
}

export function incrementUsageV2(
    userId: UserId,
    type: 'search' | 'research' | 'credits',
    amount: number
) {
    return Effect.gen(function* () {
        yield* Effect.logInfo('Incrementing usage for ' + type + ' by ' + amount);
        yield* queriesV2.incrementUsage(
            {
                userId: userId,
                type: type,
            },
            amount
        );
    });
}

export function decrementUsageV2(
    userId: UserId,
    type: 'search' | 'research' | 'credits',
    amount: number
) {
    return Effect.gen(function* () {
        yield* Effect.logInfo('Decrementing usage for ' + type + ' by ' + amount);
        yield* queriesV2.decrementUsage(
            {
                userId: userId,
                type: type,
            },
            amount
        );
    });
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
    const currentPeriodEnd = args.customer?.subscription?.currentPeriodEnd ?? 0;
    const now = new Date().getTime() / 1000;
    const isPro = Number(currentPeriodEnd) > now;

    return match({
        isPro,
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
