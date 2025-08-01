import { ThreadMessage } from '@/ai/types';
import {
    createUIMessageStream,
    streamText,
    JsonToSseTransformStream,
    type UIMessage,
    type ToolSet,
    TextStreamPart,
    UIMessageStreamWriter,
    InferUIMessageChunk,
} from 'ai';
import { Effect, Layer, Runtime } from 'effect';

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
