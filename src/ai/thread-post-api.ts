import { Session } from '@/lib/auth-effects';
import { APIError } from '@/lib/error';
import { Effect, Layer } from 'effect';
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
    incrementUsageV2,
    prepareThreadContext,
    saveMessageAndResetThreadStatus,
} from '@/ai/service';
import { Stream } from '@/ai/stream';

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

    const context = yield* prepareThreadContext({
        isAnonymous: session.user.isAnonymous ?? false,
        userId: UserId(session.user.id),
        threadId: body.id,
        streamId,
        modelId: body.modelId,
        message: body.message,
    });

    const { history, model, settings, usage, limits } = context;

    const messages = yield* convertUIMessagesToModelMessages(history, {
        supportsImages: model.capabilities.includes('vision'),
        supportsDocuments: model.capabilities.includes('documents'),
    });

    const activeTools = [body.tool].filter(tool => tool !== undefined);

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
        }),
        Stream.getTools(({ writer }) => {
            const context = Effect.succeed({
                writer,
                usage,
                userId: UserId(session.user.id),
                limits,
                runtime,
                tools: activeTools,
            });

            return getTools.pipe(Effect.provide(Layer.scoped(ToolContext, context)));
        }),
        Stream.onFinish(({ responseMessage }) => {
            return saveMessageAndResetThreadStatus({
                threadId: body.id,
                userId: UserId(session.user.id),
                message: responseMessage,
            }).pipe(
                Effect.tapError(error =>
                    Effect.logError('Error saving message and resetting thread status', error)
                ),
                latch.whenOpen
            );
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

    yield* generateThreadTitle(body.id, body.message, latch).pipe(Effect.forkDaemon);

    yield* incrementUsageV2(UserId(session.user.id), 'credits', model.credits).pipe(
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
