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
    resetThreadStatus,
    saveMessageAndResetThreadStatus,
} from '@/ai/service';
import { Stream } from '@/ai/stream';
import { calculateTokenCost } from '@/lib/cost';
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

    // search + read_site are root-level tools the model can always reach; any
    // explicitly-requested tool (research/deepSearch) is added on top. Only
    // offer tools to models that actually support tool calling.
    const activeTools = model.capabilities.includes('tools')
        ? Array.from(
              new Set([
                  'search',
                  'readSite',
                  ...[body.tool].filter((t): t is string => t !== undefined),
              ])
          )
        : [];

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

    const OPENAI_MODELS_WITH_REASONING = [
        'openai/gpt-5',
        'openai/gpt-5-mini',
        'openai/gpt-5-nano',
        'openai/gpt-5.5',
        'openai/gpt-5.5-pro',
    ];

    const openai: OpenAIResponsesProviderOptions = {
        parallelToolCalls: false,
    };

    if (OPENAI_MODELS_WITH_REASONING.includes(model.model)) {
        openai.include = ['reasoning.encrypted_content'];
        openai.reasoningSummary = 'auto';
    }

    const GOOGLE_MODELS_WITH_REASONING = [
        'google/gemini-2.5-flash',
        'google/gemini-2.5-pro',
        'google/gemini-3-pro-preview',
        'google/gemini-3.1-pro-preview',
        'google/gemini-3.5-flash',
    ];

    const google: GoogleGenerativeAIProviderOptions = {};

    if (GOOGLE_MODELS_WITH_REASONING.includes(model.model)) {
        google.thinkingConfig = {
            includeThoughts: true,
        };
    }

    // Older Claude models use extended thinking with a fixed budget. Sonnet 4.6+,
    // Opus 4.7+, and Fable 5 reject budget_tokens and sampling parameters (400)
    // and use adaptive thinking instead.
    const ANTHROPIC_LEGACY_THINKING_MODELS = [
        'anthropic/claude-4-sonnet',
        'anthropic/claude-sonnet-4.5',
        'anthropic/claude-haiku-4.5',
    ];

    const usesAdaptiveThinking =
        model.model.startsWith('anthropic/') &&
        !ANTHROPIC_LEGACY_THINKING_MODELS.includes(model.model);

    // Some models reject any non-default temperature (e.g. Kimi K2.7 Code only
    // allows temperature 1), so we omit it entirely for them.
    const MODELS_REJECTING_CUSTOM_TEMPERATURE = ['moonshotai/kimi-k2.7-code'];
    const omitTemperature =
        usesAdaptiveThinking || MODELS_REJECTING_CUSTOM_TEMPERATURE.includes(model.model);

    const anthropic: AnthropicProviderOptions = {
        sendReasoning: true,
        thinking: usesAdaptiveThinking
            ? // the installed provider types predate adaptive thinking; the
              // gateway passes this through to the Anthropic API as-is
              ({ type: 'adaptive', display: 'summarized' } as unknown as NonNullable<
                  AnthropicProviderOptions['thinking']
              >)
            : { type: 'enabled', budgetTokens: 3000 },
        disableParallelToolUse: true,
    };

    yield* Effect.logInfo('Creating stream');

    const stream = yield* Stream.create.pipe(
        Stream.options({
            model: actualModel,
            messages,
            // Fable 5 / Opus 4.8 reject temperature outright, the other
            // adaptive-thinking Claude models don't accept it alongside
            // thinking, and some models (Kimi K2.7 Code) only allow the default.
            temperature: omitTemperature ? undefined : 0.8,
            stopWhen: stepCountIs(10),
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
                    order: ['groq', 'cerebras', 'baseten'],
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
        Stream.onFinish(({ responseMessage, totalUsage }) => {
            return Effect.gen(function* () {
                if (totalUsage) {
                    const cost = calculateTokenCost(model, totalUsage);
                    yield* Effect.logInfo(
                        `Charging ${cost} micro-dollars for ${totalUsage.inputTokens} input / ${totalUsage.outputTokens} output tokens`
                    );
                    yield* incrementUsage(UserId(session.user.id), 'cost', cost).pipe(
                        Effect.tapError(error =>
                            Effect.logError('Error incrementing usage cost', error)
                        ),
                        Effect.catchAll(() => Effect.succeed(null))
                    );
                } else {
                    yield* Effect.logWarning('No token usage reported for stream, nothing charged');
                }

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

                // The writer is only present for errors raised mid-stream; when
                // the UI message stream itself fails the SDK emits its own error
                // part from the handler's return value instead.
                if (writer) {
                    writer.write({
                        type: 'data-error',
                        data: 'Error generating response',
                    });
                }

                // Reset the thread to ready so the client doesn't hang in a
                // permanent loading state when the stream fails.
                yield* resetThreadStatus(body.id).pipe(latch.whenOpen);

                // Signal completion even on error so Redis can close
                yield* Deferred.succeed(streamCompletionDeferred, undefined);
            });
        }),
        Stream.build
    );

    yield* Effect.logInfo('Creating resumable stream');

    const resumableStream = yield* createResumableStream(streamId, stream);

    const streamCompletionDeferred = yield* Deferred.make<void>();

    yield* Effect.logInfo('Creating daemon for listening to abort command');

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
