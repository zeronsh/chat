import { createServerFileRoute } from '@tanstack/react-start/server';
import { Effect, Layer } from 'effect';
import { SessionLive, Session } from '@/lib/auth';
import { DatabaseLive } from '@/database/effect';
import { APIError } from '@/lib/error';
import { z } from 'zod';
import { UserId } from '@/database/types';
import { nanoid } from 'nanoid';
import { smoothStream, stepCountIs } from 'ai';
import { getTools, ToolContext } from '@/ai/tools';
import { getSystemPrompt } from '@/ai/prompt';
import {
    convertUIMessagesToModelMessages,
    createResumableStream,
    generateThreadTitle,
    incrementUsage,
    prepareThreadContext,
    saveMessageAndResetThreadStatus,
} from '@/ai/service';
import { Stream } from '@/ai/stream';
import { listen, subscribe, unsubscribe } from '@/lib/redis';
import { Database } from '@/database/effect';

export const ServerRoute = createServerFileRoute('/api/thread').methods({
    async POST({ request }) {
        return threadPostApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(SessionLive(request)),
            Effect.provide(ThreadPostBodyLive(request)),
            Effect.provide(DatabaseLive),
            Effect.runPromise
        );
    },
});

const threadPostApi = Effect.gen(function* () {
    const session = yield* Session;
    const body = yield* ThreadPostBody;

    return yield* threadPostApiHandler.pipe(
        Effect.annotateLogs('requestId', nanoid()),
        Effect.annotateLogs('userId', session.user.id),
        Effect.annotateLogs('threadId', body.id)
    );
});

const threadPostApiHandler = Effect.gen(function* () {
    const runtime = yield* Effect.runtime<Database>();
    const latch = yield* Effect.makeLatch();

    yield* latch.open;

    const session = yield* Session;
    const body = yield* ThreadPostBody;

    const streamId = nanoid();

    const context = yield* prepareThreadContext({
        isAnonymous: session.user.isAnonymous ?? false,
        userId: UserId(session.user.id),
        threadId: body.id,
        streamId,
        modelId: body.modelId,
        message: body.message,
    });

    const { history, model, settings, usage, limits, thread } = context;

    const messages = yield* convertUIMessagesToModelMessages(history, {
        supportsImages: model.capabilities.includes('vision'),
        supportsDocuments: model.capabilities.includes('documents'),
    });

    const activeTools = [body.tool].filter(tool => tool !== undefined);

    const controller = new AbortController();

    yield* subscribe(`abort:${body.id}`);
    yield* listen((channel, message) => {
        return Effect.gen(function* () {
            if (channel === `abort:${body.id}` && message === 'abort') {
                yield* Effect.log('Aborting stream');
                controller.abort();
            }
        });
    });

    const stream = yield* Stream.create.pipe(
        Stream.options({
            model: model.model,
            messages,
            temperature: 0.8,
            stopWhen: stepCountIs(3),
            system: getSystemPrompt(settings, activeTools),
            experimental_transform: smoothStream({
                chunking: 'word',
            }),
            abortSignal: controller.signal,
        }),
        Stream.getTools(({ writer }) => {
            return getTools.pipe(
                Effect.provide(
                    Layer.scoped(
                        ToolContext,
                        Effect.succeed({
                            writer,
                            usage,
                            userId: UserId(session.user.id),
                            limits,
                            runtime,
                            tools: activeTools,
                        })
                    )
                )
            );
        }),
        Stream.onFinish(({ responseMessage }) => {
            return Effect.gen(function* () {
                yield* unsubscribe(`abort:${body.id}`);
                yield* saveMessageAndResetThreadStatus({
                    threadId: body.id,
                    userId: UserId(session.user.id),
                    message: responseMessage,
                }).pipe(
                    Effect.tapError(error =>
                        Effect.logError('Error saving message and resetting thread status', error)
                    ),
                    Effect.catchAll(() => Effect.succeed(null)),
                    latch.whenOpen
                );
            });
        }),
        Stream.onMessageMetadata(({ part }) => {
            return Effect.gen(function* () {
                if (part.type === 'start') {
                    return {
                        model: {
                            id: model.id,
                            name: model.name,
                            icon: model.icon,
                        },
                    };
                }
            });
        }),
        Stream.onError(({ error, writer }) => {
            return Effect.gen(function* () {
                yield* Effect.logError('Error in stream', error);
                writer.write({
                    type: 'data-error',
                    data: 'Error generating response',
                });
            });
        }),
        Stream.build
    );

    const resumableStream = yield* createResumableStream(streamId, stream);

    if (!thread.title) {
        yield* generateThreadTitle(body.id, body.message, latch).pipe(Effect.forkDaemon);
    }

    yield* incrementUsage(UserId(session.user.id), 'credits', model.credits).pipe(
        Effect.forkDaemon
    );

    return new Response(resumableStream);
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
