import { ThreadMessage } from '@/ai/types';
import {
    createUIMessageStream,
    streamText,
    JsonToSseTransformStream,
    convertToModelMessages,
    type UIMessage,
    type ToolSet,
    StopCondition,
    ModelMessage,
    TextStreamPart,
    UIMessageStreamWriter,
    InferUIMessageChunk,
} from 'ai';
import { Data, Duration, Effect, Layer, Runtime, Schedule } from 'effect';
import { type ResumableStreamContext } from 'resumable-stream';

export type StreamTextOptions = Omit<
    Parameters<typeof streamText>[0],
    'onError' | 'onFinish' | 'tools'
>;

export type InferMessageToolSet<Message extends UIMessage> = Message extends UIMessage<
    infer _,
    infer __,
    infer Tools
>
    ? Tools extends ToolSet
        ? Tools
        : never
    : {};

export type InferMessageMetadata<Message extends UIMessage> = Message extends UIMessage<
    infer Metadata,
    infer _,
    infer __
>
    ? Metadata
    : {};

export type CreateResumeStreamOptions = {
    streamContext: ResumableStreamContext;

    /**
     * This is where you should do any setup that you need to do before the stream resumes
     * such as fetching data from the database, etc.
     *
     * @param options
     * @returns the stream id for the resumable stream
     */
    onPrepare: () => Promise<string>;
};

export function createResumeStreamResponse(options: CreateResumeStreamOptions) {
    const { streamContext, onPrepare } = options;

    const effect = Effect.gen(function* () {
        const streamId = yield* Effect.tryPromise({
            try: () => onPrepare(),
            catch: error => {
                if (error instanceof AIError) {
                    return new InternalError({
                        code: error.code,
                        message: error.message,
                        metadata: error.metadata,
                        cause: error.cause,
                        status: error.status,
                    });
                }

                return new InternalError({
                    code: 'UnexpectedError',
                    message: 'Unexpected error while preparing the stream',
                    cause: error,
                    status: 500,
                });
            },
        });

        const stream = yield* Effect.tryPromise({
            try: async () => {
                const emptyDataStream = createUIMessageStream({
                    execute: () => {},
                });
                const stream = await streamContext.resumableStream(streamId, () =>
                    emptyDataStream.pipeThrough(new JsonToSseTransformStream())
                );

                if (!stream) {
                    throw new AIError('StreamNotFound', {
                        message: 'Stream not found',
                        metadata: {
                            streamId,
                        },
                    });
                }

                return stream;
            },
            catch: error => {
                if (error instanceof AIError) {
                    return new InternalError({
                        code: error.code,
                        message: error.message,
                        metadata: error.metadata,
                        cause: error.cause,
                        status: error.status,
                    });
                }
                return new InternalError({
                    code: 'UnexpectedError',
                    message: 'Unexpected error while resuming the stream',
                    cause: error,
                    status: 500,
                });
            },
        }).pipe(
            Effect.retry(
                Schedule.exponential(Duration.millis(200)).pipe(
                    Schedule.compose(Schedule.recurs(3))
                )
            )
        );

        return new Response(stream);
    });

    return effect.pipe(
        Effect.catchTag('InternalError', error => {
            console.log(error);
            return Effect.succeed(
                Response.json(
                    {
                        error: {
                            code: error.code,
                            message: error.message,
                            metadata: error.metadata,
                        },
                    },
                    { status: error.status }
                )
            );
        }),
        Effect.runPromise
    );
}

export type AIErrorOptions = {
    status?: number;
    cause?: unknown;
    message?: string;
    metadata?: any;
};

export class AIError<T extends string> {
    readonly code: T;
    readonly status?: number;
    readonly cause?: unknown;
    readonly message?: string;
    readonly metadata?: Record<string, unknown>;

    constructor(code: T, options?: AIErrorOptions) {
        this.code = code;
        this.status = options?.status ?? 500;
        this.cause = options?.cause;
        this.message = options?.message;
        this.metadata = options?.metadata;
    }
}

class InternalError extends Data.TaggedError('InternalError')<{
    code: string;
    status?: number;
    message?: string;
    metadata?: any;
    cause?: unknown;
}> {}

const createStreamSSEResponse = Effect.gen(function* () {
    const runtime = yield* Effect.runtime();
    const options = yield* CreateStreamSSEResponseOptions;
    const { onFinishCallback } = yield* CreateStreamSSEResponseOnFinish;
    const { onErrorCallback } = yield* CreateStreamSSEResponseOnError;
    const { onMessageMetadataCallback } = yield* CreateStreamSSEResponseOnMessageMetadata;
    const { getToolsCallback } = yield* CreateStreamSSEResponseGetTools;

    return createUIMessageStream<ThreadMessage>({
        onFinish: ({ responseMessage }) => {
            // @ts-expect-error - TODO: fix this
            return Runtime.runPromise(runtime, onFinishCallback({ responseMessage }));
        },
        execute: ({ writer }) => {
            // @ts-expect-error - TODO: fix this
            const tools = Runtime.runSync(runtime, getToolsCallback({ writer }));

            const result = streamText({
                ...options,
                tools,
                onError: error => {
                    // @ts-expect-error - TODO: fix this
                    return Runtime.runPromise(runtime, onErrorCallback({ error, writer }));
                },
            });

            result.consumeStream();
            writer.merge(
                result.toUIMessageStream({
                    sendReasoning: true,
                    messageMetadata: ({ part }) => {
                        // @ts-expect-error - TODO: fix this
                        return Runtime.runSync(runtime, onMessageMetadataCallback({ part }));
                    },
                })
            );
        },
    });
});

export type OnFinishCallback<A = void, E = never, R = never> = (options: {
    responseMessage: ThreadMessage;
}) => Effect.Effect<A, E, R>;

export class CreateStreamSSEResponseOnFinish extends Effect.Tag('CreateStreamSSEResponseOnFinish')<
    CreateStreamSSEResponseOnFinish,
    {
        readonly onFinishCallback: OnFinishCallback<any, any, any>;
    }
>() {}

export type OnErrorCallback<A = void, E = never, R = never> = (options: {
    error: unknown;
    writer: UIMessageStreamWriter<ThreadMessage>;
}) => Effect.Effect<A, E, R>;

export class CreateStreamSSEResponseOnError extends Effect.Tag('CreateStreamSSEResponseOnError')<
    CreateStreamSSEResponseOnError,
    {
        readonly onErrorCallback: OnErrorCallback<any, any, any>;
    }
>() {}

export type OnMessageMetadataCallback<A = void, E = never, R = never> = (options: {
    part: TextStreamPart<InferMessageToolSet<ThreadMessage>>;
}) => Effect.Effect<A, E, R>;

export class CreateStreamSSEResponseOnMessageMetadata extends Effect.Tag(
    'CreateStreamSSEResponseOnMessageMetadata'
)<
    CreateStreamSSEResponseOnMessageMetadata,
    {
        readonly onMessageMetadataCallback: OnMessageMetadataCallback<any, any, any>;
    }
>() {}

export class CreateStreamSSEResponseOptions extends Effect.Tag('CreateStreamSSEResponseOptions')<
    CreateStreamSSEResponseOptions,
    StreamTextOptions
>() {}

export type GetToolsCallback<E = never, R = never> = (options: {
    writer: UIMessageStreamWriter<ThreadMessage>;
}) => Effect.Effect<ToolSet, E, R>;

export class CreateStreamSSEResponseGetTools extends Effect.Tag('CreateStreamSSEResponseGetTools')<
    CreateStreamSSEResponseGetTools,
    {
        readonly getToolsCallback: GetToolsCallback<any, any>;
    }
>() {}

export class Stream {
    static create = createStreamSSEResponse;

    static onFinish<A = void, E = never, R = never>(callback: OnFinishCallback<A, E, R>) {
        return Effect.provide(
            Layer.scoped(
                CreateStreamSSEResponseOnFinish,
                Effect.succeed({ onFinishCallback: callback })
            )
        );
    }

    static onError<A = void, E = never, R = never>(callback: OnErrorCallback<A, E, R>) {
        return Effect.provide(
            Layer.scoped(
                CreateStreamSSEResponseOnError,
                Effect.succeed({ onErrorCallback: callback })
            )
        );
    }

    static onMessageMetadata<A = void, E = never, R = never>(
        callback: OnMessageMetadataCallback<A, E, R>
    ) {
        return Effect.provide(
            Layer.scoped(
                CreateStreamSSEResponseOnMessageMetadata,
                Effect.succeed({ onMessageMetadataCallback: callback })
            )
        );
    }

    static getTools<E = never, R = never>(callback: GetToolsCallback<E, R>) {
        return Effect.provide(
            Layer.scoped(
                CreateStreamSSEResponseGetTools,
                Effect.succeed({ getToolsCallback: callback })
            )
        );
    }

    static options(options: StreamTextOptions) {
        return Effect.provide(
            Layer.scoped(CreateStreamSSEResponseOptions, Effect.succeed(options))
        );
    }

    static build = Effect.map((stream: ReadableStream<InferUIMessageChunk<ThreadMessage>>) => {
        return stream.pipeThrough(new JsonToSseTransformStream());
    });
}
