import { createServerFileRoute } from '@tanstack/react-start/server';
import { Effect, Layer, Deferred } from 'effect';
import { SessionLive, Session } from '@/lib/auth';
import { DatabaseLive } from '@/database/effect';
import { APIError } from '@/lib/error';
import { z } from 'zod';
import { UserId } from '@/database/types';
import { nanoid } from 'nanoid';
import { extractReasoningMiddleware, smoothStream, stepCountIs, wrapLanguageModel } from 'ai';
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
import { RedisLive } from '@/lib/redis';
import { Database } from '@/database/effect';
import type { OpenAIResponsesProviderOptions } from '@ai-sdk/openai';
import type { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import type { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { gateway } from '@ai-sdk/gateway';
import { RedisPubSub } from 'effect-redis';

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

    const controller = new AbortController();

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

    const MODEL_REQUIRES_MIDDLEWARE = [
        'zai/glm-4.5-air',
        'zai/glm-4.5',
        'deepseek/deepseek-r1-distill-llama-70b',
        'deepseek/deepseek-r1',
    ];

    const actualModel = MODEL_REQUIRES_MIDDLEWARE.includes(model.model)
        ? wrapLanguageModel({
              model: gateway(model.model),
              middleware: extractReasoningMiddleware({
                  tagName: 'think',
              }),
          })
        : model.model;

    const OPENAI_MODELS_WITH_REASONING = ['openai/gpt-5', 'openai/gpt-5-mini', 'openai/gpt-5-nano'];

    const openai: OpenAIResponsesProviderOptions = {
        parallelToolCalls: false,
    };

    if (OPENAI_MODELS_WITH_REASONING.includes(model.model)) {
        openai.include = ['reasoning.encrypted_content'];
        openai.reasoningSummary = 'auto';
    }

    const GOOGLE_MODELS_WITH_REASONING = ['google/gemini-2.5-flash', 'google/gemini-2.5-pro'];

    const google: GoogleGenerativeAIProviderOptions = {};

    if (GOOGLE_MODELS_WITH_REASONING.includes(model.model)) {
        google.thinkingConfig = {
            includeThoughts: true,
        };
    }

    const anthropic: AnthropicProviderOptions = {
        sendReasoning: true,
        thinking: {
            type: 'enabled',
            budgetTokens: 3000,
        },
        disableParallelToolUse: true,
    };

    const stream = yield* Stream.create.pipe(
        Stream.options({
            model: actualModel,
            messages,
            temperature: 0.8,
            stopWhen: stepCountIs(3),
            system: getSystemPrompt(settings, activeTools),
            experimental_transform: smoothStream({
                chunking: 'word',
                delayInMs: 3,
            }),
            abortSignal: controller.signal,
            providerOptions: {
                openai,
                google,
                anthropic,
                gateway: {
                    order: ['groq', 'cerebras'],
                },
            },
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
                            signal: controller.signal,
                        })
                    )
                )
            );
        }),
        Stream.onFinish(({ responseMessage }) => {
            return Effect.gen(function* () {
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

                // Signal that streaming is complete so Redis can close
                yield* Deferred.succeed(streamCompletionDeferred, undefined);
            });
        }),
        Stream.onMessageMetadata(({ part, writer }) => {
            return Effect.gen(function* () {
                if (part.type === 'reasoning-start') {
                    writer.write({
                        type: 'data-reasoning-time',
                        data: {
                            id: part.id,
                            type: 'start',
                            timestamp: new Date().getTime(),
                        },
                    });
                }
                if (part.type === 'reasoning-end') {
                    writer.write({
                        type: 'data-reasoning-time',
                        data: {
                            id: part.id,
                            type: 'end',
                            timestamp: new Date().getTime(),
                        },
                    });
                }
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

                // Signal completion even on error so Redis can close
                yield* Deferred.succeed(streamCompletionDeferred, undefined);
            });
        }),
        Stream.build
    );

    const resumableStream = yield* createResumableStream(streamId, stream);

    const streamCompletionDeferred = yield* Deferred.make<void>();

    yield* Effect.gen(function* () {
        const pubsub = yield* RedisPubSub;

        yield* pubsub.subscribe(`abort:${body.id}`, _ => {
            controller.abort();
        });

        yield* Effect.race(
            Effect.async<void>(resume => {
                controller.signal.addEventListener('abort', () => {
                    resume(Effect.succeed(undefined));
                });
            }),
            Deferred.await(streamCompletionDeferred)
        );
    }).pipe(
        Effect.tapError(error => Effect.logError('Error in daemon subscribing to abort', error)),
        Effect.catchAll(() => Effect.succeed(null)),
        Effect.provide(RedisLive),
        Effect.forkDaemon
    );

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
