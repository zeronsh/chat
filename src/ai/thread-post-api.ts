import { db, Transaction } from '@/database';
import { Session } from '@/lib/auth-effects';
import { APIError } from '@/lib/error';
import { Effect, Layer, Runtime } from 'effect';
import { z } from 'zod';
import * as queries from '@/database/queries';
import { UserId } from '@/database/types';
import { AnonymousLimits } from '@/lib/constants';
import { match } from 'ts-pattern';
import { FreeLimits, ProLimits } from '@/lib/constants';
import { nanoid } from 'nanoid';
import { ThreadMessage } from '@/ai/types';
import { convertUIMessagesToModelMessages } from '@/ai/stream';
import {
    createUIMessageStream,
    JsonToSseTransformStream,
    smoothStream,
    stepCountIs,
    streamText,
} from 'ai';
import { getTools, ToolContext } from '@/ai/tools';
import { getSystemPrompt } from '@/ai/prompt';
import {
    generateThreadTitle,
    incrementUsage,
    saveMessageAndResetThreadStatus,
    streamContext,
} from '@/ai/service';

export const threadPostApi = Effect.gen(function* () {
    const session = yield* Session;
    const body = yield* ThreadPostBody;

    return yield* threadPostApiHandler.pipe(
        Effect.annotateLogs('requestId', nanoid()),
        Effect.annotateLogs('userId', session.user.id),
        Effect.annotateLogs('threadId', body.id)
    );
});

const threadPostApiHandler = Effect.gen(function* () {
    const runtime = yield* Effect.runtime();
    const latch = yield* Effect.makeLatch();

    yield* latch.open;

    const session = yield* Session;
    const body = yield* ThreadPostBody;

    const streamId = nanoid();

    const { history, thread, message, model, settings, usage, limits } = yield* Effect.tryPromise({
        try: () => {
            return db.transaction(async tx => {
                return Runtime.runPromise(
                    runtime,
                    prepareThread(tx, {
                        isAnonymous: session.user.isAnonymous ?? false,
                        userId: UserId(session.user.id),
                        threadId: body.id,
                        streamId,
                        modelId: body.modelId,
                        message: body.message,
                    })
                );
            });
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to prepare thread',
                cause: error,
            });
        },
    });

    const messages = yield* Effect.tryPromise({
        try: () => {
            return convertUIMessagesToModelMessages(history, {
                supportsImages: model.capabilities.includes('vision'),
                supportsDocuments: model.capabilities.includes('documents'),
            });
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to convert UI messages to model messages',
                cause: error,
            });
        },
    });

    const stream = yield* Effect.try({
        try: () => {
            return createUIMessageStream<ThreadMessage>({
                onFinish: async ({ responseMessage }) => {
                    await Runtime.runPromise(
                        runtime,
                        handleFinish({
                            threadId: body.id,
                            userId: UserId(session.user.id),
                            message: responseMessage,
                        }).pipe(latch.whenOpen)
                    );
                },
                execute: ({ writer }) => {
                    const tools = Runtime.runSync(
                        runtime,
                        getTools.pipe(
                            Effect.provide(
                                Layer.scoped(
                                    ToolContext,
                                    Effect.succeed({
                                        writer,
                                        usage,
                                        userId: UserId(session.user.id),
                                        limits,
                                        runtime,
                                        tools: body.tool ? [body.tool] : [],
                                    })
                                )
                            )
                        )
                    );

                    const result = streamText({
                        model: model.model,
                        messages,
                        temperature: 0.8,
                        stopWhen: stepCountIs(3),
                        system: getSystemPrompt(settings, body.tool ? [body.tool] : []),
                        tools,
                        experimental_transform: smoothStream({
                            chunking: 'word',
                        }),
                        providerOptions: {
                            gateway: {
                                order: ['groq'],
                            },
                        },
                        onError: error => {
                            Runtime.runSync(
                                runtime,
                                Effect.logError('Error in stream', {
                                    error,
                                })
                            );

                            writer.write({
                                type: 'data-error',
                                data: 'Error generating response',
                            });
                        },
                    });

                    result.consumeStream();
                    writer.merge(
                        result.toUIMessageStream({
                            sendReasoning: true,
                            messageMetadata: ({ part }) => {
                                if (part.type === 'start') {
                                    return {
                                        model: {
                                            id: model.id,
                                            name: model.name,
                                            icon: model.icon,
                                        },
                                    };
                                }
                            },
                        })
                    );
                },
            });
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to create stream',
                cause: error,
            });
        },
    }).pipe(Effect.map(stream => stream.pipeThrough(new JsonToSseTransformStream())));

    const resumableStream = yield* Effect.tryPromise({
        try: () => {
            return streamContext.createNewResumableStream(streamId, () => stream);
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to create resumable stream',
                cause: error,
            });
        },
    });

    yield* Effect.gen(function* () {
        if (!thread.title) {
            yield* latch.close;
            yield* Effect.logInfo('Generating thread title');
            yield* Effect.tryPromise(() => generateThreadTitle(body.id, message.message)).pipe(
                Effect.catchAll(() => Effect.succeed(null))
            );
            yield* latch.open;
        }
    }).pipe(Effect.forkDaemon);

    yield* Effect.logInfo('Incrementing usage');
    yield* Effect.tryPromise(async () => {
        return incrementUsage(UserId(session.user.id), 'credits', model.credits);
    }).pipe(Effect.forkDaemon);

    return new Response(resumableStream);
});

const prepareThread = Effect.fn('prepareThread')(function* (
    tx: Transaction,
    args: {
        isAnonymous: boolean;
        userId: UserId;
        threadId: string;
        streamId: string;
        modelId: string;
        message: ThreadMessage;
    }
) {
    yield* Effect.logInfo('Preparing thread');
    let [thread, message, model, settings, usage, customer] = yield* Effect.tryPromise({
        try: () => {
            return Promise.all([
                queries.getThreadById(tx, args.threadId),
                queries.getMessageById(tx, args.message.id),
                queries.getModelById(tx, args.modelId),
                queries.getSettingsByUserId(tx, args.userId),
                queries.getUsageByUserId(tx, args.userId),
                queries.getUserCustomerByUserId(tx, args.userId),
            ]);
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to prepare thread',
                cause: error,
            });
        },
    });

    if (!settings) {
        return yield* new APIError({
            status: 404,
            message: 'Settings for user (userId) does not exist',
            metadata: {
                userId: args.userId,
            },
        });
    }

    if (!usage) {
        return yield* new APIError({
            status: 404,
            message: 'Usage for user (userId) does not exist',
            metadata: {
                userId: args.userId,
            },
        });
    }

    if (!model) {
        return yield* new APIError({
            status: 404,
            message: 'Model with (modelId) does not exist',
            metadata: {
                modelId: args.modelId,
            },
        });
    }

    if (!thread) {
        yield* Effect.logInfo('Creating thread');
        [thread] = yield* Effect.tryPromise({
            try: () => {
                return queries.createThread(tx, {
                    userId: args.userId,
                    threadId: args.threadId,
                });
            },
            catch: error => {
                return new APIError({
                    status: 500,
                    message: 'Failed to create thread',
                    cause: error,
                });
            },
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

    const limits = match({
        isPro: Number(customer?.subscription?.currentPeriodEnd ?? 0) > new Date().getTime() / 1000,
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
        return yield* new APIError({
            status: 403,
            message: 'You have reached your credit limit.',
        });
    }

    yield* Effect.logInfo('Update thread status to streaming');
    yield* Effect.tryPromise({
        try: () => {
            return queries.updateThread(tx, {
                threadId: args.threadId,
                status: 'streaming',
                streamId: args.streamId,
                updatedAt: new Date(),
            });
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to update thread',
                cause: error,
            });
        },
    });

    if (message) {
        yield* Effect.logInfo('Message exists - updating message and deleting trailing messages');
        let tmp = message;
        [[message]] = yield* Effect.tryPromise({
            try: () => {
                return Promise.all([
                    queries.updateMessage(tx, {
                        messageId: args.message.id,
                        message: args.message,
                        updatedAt: new Date(),
                    }),
                    queries.deleteTrailingMessages(tx, {
                        threadId: args.threadId,
                        messageId: args.message.id,
                        messageCreatedAt: tmp.createdAt,
                    }),
                ]);
            },
            catch: error => {
                return new APIError({
                    status: 500,
                    message: 'Failed to update message',
                    cause: error,
                });
            },
        });
    }

    if (!message) {
        yield* Effect.logInfo('Creating message');
        [message] = yield* Effect.tryPromise({
            try: () => {
                return queries.createMessage(tx, {
                    threadId: args.threadId,
                    userId: args.userId,
                    message: args.message,
                });
            },
            catch: error => {
                return new APIError({
                    status: 500,
                    message: 'Failed to create message',
                    cause: error,
                });
            },
        });
    }

    const history = yield* Effect.tryPromise({
        try: () => {
            return queries.getThreadMessageHistory(tx, args.threadId);
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to get thread message history',
                cause: error,
            });
        },
    });

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

const handleFinish = Effect.fn('handleFinish')(function* (args: {
    threadId: string;
    userId: UserId;
    message: ThreadMessage;
}) {
    const { threadId, userId, message } = args;

    yield* Effect.logInfo('Saving message and resetting thread status');
    yield* Effect.tryPromise({
        try: () => {
            return saveMessageAndResetThreadStatus({
                threadId,
                userId,
                message,
            });
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to save message and reset thread status',
                cause: error,
            });
        },
    });
});

const ThreadPostApiSchema = z.object({
    id: z.string(),
    modelId: z.string(),
    message: z.any(),
    tool: z.string().optional(),
});

export class ThreadPostBody extends Effect.Tag('ThreadPostBody')<
    ThreadPostBody,
    z.infer<typeof ThreadPostApiSchema>
>() {}

export const ThreadPostBodyLive = (request: Request) =>
    Layer.scoped(
        ThreadPostBody,
        Effect.gen(function* () {
            const json = yield* Effect.tryPromise({
                try: () => request.json(),
                catch: error => {
                    return new APIError({
                        status: 400,
                        message: 'Invalid request body',
                        cause: error,
                    });
                },
            });

            return yield* Effect.try({
                try: () => ThreadPostApiSchema.parse(json),
                catch: error => {
                    return new APIError({
                        status: 400,
                        message: 'Invalid request body',
                        cause: error,
                    });
                },
            });
        })
    );
