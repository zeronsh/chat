import { z, ZodError, ZodType } from 'zod';
import {
    createUIMessageStream,
    streamText,
    type UIMessage,
    type UIMessageStreamWriter,
    JsonToSseTransformStream,
    type TextStreamPart,
    type ToolSet,
} from 'ai';
import { Data, Duration, Effect, Schedule } from 'effect';
import { type ResumableStreamContext } from 'resumable-stream';

export type StreamTextOptions = Omit<Parameters<typeof streamText>[0], 'onError' | 'onFinish'>;

export type InferMessageToolSet<Message extends UIMessage> =
    Message extends UIMessage<infer Metadata, infer DataParts, infer Tools>
        ? Tools extends ToolSet
            ? Tools
            : never
        : {};

export type InferMessageMetadata<Message extends UIMessage> =
    Message extends UIMessage<infer Metadata, infer DataParts, infer Tools> ? Metadata : {};

export type CreateStreamUIMessageResponseOptions<
    Message extends UIMessage,
    Schema extends ZodType,
    PrepareReturn,
> = {
    request: Request;
    schema: Schema;

    /**
     * Prepare the context for the stream.
     * This is where you should do any setup that you need to do before the stream starts
     * such as fetching data from the database, etc.
     *
     * The return value of this function will be passed to the `onStream` function.
     *
     * @param options - The options for the stream.
     * @returns The context for the stream.
     */
    onPrepare: (options: { body: z.infer<Schema>; request: Request }) => Promise<PrepareReturn>;

    /**
     * The function that will be called to stream the response.
     * In cannot return a promise, because it will be called in the context of the stream.
     *
     * @param options - The options for the stream.
     * @returns The options for the stream.
     */
    onStream: (options: {
        body: z.infer<Schema>;
        writer: UIMessageStreamWriter<Message>;
        context: PrepareReturn;
    }) => StreamTextOptions;

    onStreamMessageMetadata?: (options: {
        part: TextStreamPart<InferMessageToolSet<Message>>;
        context: PrepareReturn;
    }) => InferMessageMetadata<Message> | undefined;

    onStreamError?: (options: {
        body: z.infer<Schema>;
        writer: UIMessageStreamWriter<Message>;
        context: PrepareReturn;
        error: unknown;
    }) => Promise<any>;

    /**
     * The function that will be called after the stream has been created.
     * This is where you can do anything such as setting up resumable streams, etc.
     * This is forked as a daemon, so it will not block the main execution.
     *
     * @param options - The options for the stream.
     * @returns The options for the stream.
     */
    onAfterStream?: (options: {
        body: z.infer<Schema>;
        stream: ReadableStream<any>;
        context: PrepareReturn;
    }) => Promise<void>;
    onFinish?: (options: {
        messages: Message[];
        isContinuation: boolean;
        responseMessage: Message;
        context: PrepareReturn;
    }) => Promise<void>;

    streamContext?: ResumableStreamContext;
    onGetStreamId?: (options: { context: PrepareReturn }) => string;
};

export function createUIMessageStreamResponse<Message extends UIMessage>() {
    return async <Schema extends ZodType, PrepareReturn = any>(
        options: CreateStreamUIMessageResponseOptions<Message, Schema, PrepareReturn>
    ): Promise<Response> => {
        const {
            request,
            schema,
            onPrepare,
            onStream,
            onAfterStream,
            onFinish,
            onStreamError,
            onStreamMessageMetadata,
        } = options;

        const effect = Effect.gen(function* () {
            const json = yield* Effect.tryPromise({
                try: () => request.json(),
                catch: error => {
                    return new InternalError({
                        code: 'UnexpectedError',
                        message: 'Unexpected error while parsing the request body',
                        cause: error,
                        status: 500,
                    });
                },
            });

            const body = yield* Effect.try({
                try: () => schema.parse(json),
                catch: error => {
                    if (error instanceof ZodError) {
                        return new InternalError({
                            code: 'InvalidRequest',
                            message: 'Invalid request body',
                            metadata: error.errors,
                            cause: error,
                            status: 400,
                        });
                    }

                    return new InternalError({
                        code: 'UnexpectedError',
                        message: 'Unexpected error while parsing the request body',
                        cause: error,
                        status: 500,
                    });
                },
            });

            const context = yield* Effect.tryPromise({
                try: () => onPrepare({ body, request }),
                catch: error => {
                    if (error instanceof AIError) {
                        return new InternalError({
                            code: error.code,
                            message: error.message,
                            metadata: error.metadata,
                            cause: error.cause,
                        });
                    }

                    return new InternalError({
                        code: 'UnexpectedError',
                        message: 'Unexpected error while parsing the request body',
                        cause: error,
                        status: 500,
                    });
                },
            });

            const stream = yield* Effect.try({
                try: () => {
                    return createUIMessageStream<Message>({
                        onFinish: async ({ messages, isContinuation, responseMessage }) => {
                            if (onFinish) {
                                await onFinish({
                                    messages,
                                    isContinuation,
                                    responseMessage,
                                    context,
                                });
                            }
                        },
                        execute: ({ writer }) => {
                            const options = onStream({
                                body,
                                writer,
                                context,
                            });

                            const result = streamText({
                                ...options,
                                onError: async error => {
                                    if (onStreamError) {
                                        await onStreamError({ body, writer, context, error }).catch(
                                            e => {
                                                console.log(e);
                                            }
                                        );
                                    }
                                },
                            });

                            result.consumeStream();
                            writer.merge(
                                result.toUIMessageStream({
                                    sendReasoning: true,
                                    messageMetadata: options => {
                                        if (onStreamMessageMetadata) {
                                            return onStreamMessageMetadata({
                                                // @ts-expect-error - TODO: fix this
                                                part: options.part,
                                                context,
                                            });
                                        }
                                    },
                                })
                            );
                        },
                    });
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
                        message: 'Unexpected error while parsing the request body',
                        cause: error,
                        status: 500,
                    });
                },
            });

            const streams = stream.pipeThrough(new JsonToSseTransformStream()).tee();

            if (onAfterStream) {
                yield* Effect.forkDaemon(
                    Effect.tryPromise({
                        try: () => onAfterStream({ stream: streams[1], body, context }),
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
                                message: 'Unexpected error while parsing the request body',
                                cause: error,
                                status: 500,
                            });
                        },
                    })
                );
            }

            return new Response(streams[0]);
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
    };
}

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
                return new InternalError({
                    code: 'UnexpectedError',
                    message: 'Unexpected error while resuming the stream',
                    cause: error,
                    status: 500,
                });
            },
        }).pipe(Effect.retry(Schedule.exponential(200).pipe(Schedule.compose(Schedule.recurs(5)))));

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
