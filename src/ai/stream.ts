import {
    createUIMessageStream,
    streamText,
    JsonToSseTransformStream,
    convertToModelMessages,
    type UIMessage,
    type ToolSet,
} from 'ai';
import { Data, Duration, Effect, Schedule } from 'effect';
import { type ResumableStreamContext } from 'resumable-stream';

export type StreamTextOptions = Omit<Parameters<typeof streamText>[0], 'onError' | 'onFinish'>;

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

export async function convertUIMessagesToModelMessages<T extends UIMessage>(
    messages: T[],
    options: {
        supportsImages?: boolean;
        supportsDocuments?: boolean;
    } = {
        supportsImages: false,
        supportsDocuments: false,
    }
) {
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
}
