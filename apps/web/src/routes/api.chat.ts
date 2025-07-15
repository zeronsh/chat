import type { ThreadMessage } from '@/lib/types';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { smoothStream } from 'ai';
import { convertUIMessagesToModelMessages, createUIMessageStreamResponse } from '@zeronsh/ai';
import z from 'zod';
import { auth } from '@/lib/auth';
import { ThreadError } from '@/lib/error';
import {
    generateThreadTitle,
    prepareThread,
    saveMessageAndResetThreadStatus,
    streamContext,
} from '@/lib/chat';
import { nanoid } from '@zeronsh/ai/utils';

export const ServerRoute = createServerFileRoute('/api/chat').methods({
    async POST({ request }) {
        return createUIMessageStreamResponse<ThreadMessage>()({
            request,
            schema: z.object({
                id: z.string(),
                modelId: z.string(),
                message: z.any(),
            }),
            onPrepare: async ({ body, request }) => {
                const session = await auth.api.getSession({
                    headers: request.headers,
                });

                if (!session) {
                    throw new ThreadError('NotAuthorized');
                }

                const streamId = nanoid();

                const { history, thread, message, model } = await prepareThread({
                    streamId,
                    modelId: body.modelId,
                    userId: session.user.id,
                    threadId: body.id,
                    message: body.message,
                });

                return {
                    streamId,
                    threadId: thread.id,
                    userId: session.user.id,
                    model,
                    thread,
                    message,
                    messages: await convertUIMessagesToModelMessages(history, {
                        supportsImages: model.capabilities.includes('vision'),
                        supportsDocuments: model.capabilities.includes('documents'),
                    }),
                };
            },
            onStream: ({ context: { messages, model } }) => {
                return {
                    model: model.model,
                    messages,
                    temperature: 0.8,
                    experimental_transform: smoothStream({
                        chunking: 'word',
                    }),
                    providerOptions: {
                        gateway: {
                            order: ['groq'],
                        },
                    },
                };
            },
            onStreamMessageMetadata: ({ part, context: { model } }) => {
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
            onAfterStream: async ({ context: { threadId, message, streamId, thread }, stream }) => {
                const promises: Promise<any>[] = [];

                if (!thread.title) {
                    promises.push(generateThreadTitle(threadId, message.message));
                }

                promises.push(streamContext.createNewResumableStream(streamId, () => stream));

                await Promise.all(promises);
            },
            onStreamError: ({ error, writer }) => {
                console.error(error);
                writer.write({
                    type: 'data-error',
                    data: 'Error generating response.',
                });
            },
            onFinish: async ({ responseMessage, context: { threadId, userId } }) => {
                await saveMessageAndResetThreadStatus({
                    threadId,
                    userId,
                    message: responseMessage,
                });
            },
        });
    },
});
