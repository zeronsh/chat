import type { ThreadMessage } from '@/lib/types';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { convertToModelMessages, smoothStream } from 'ai';
import { createUIMessageStreamResponse } from '@zeronsh/ai';
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
                    message,
                    messages: convertToModelMessages(history),
                };
            },
            onStream: ({ context: { messages, model } }) => {
                return {
                    model: model.model,
                    messages,
                    experimental_transform: smoothStream({
                        chunking: 'word',
                    }),
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
            onAfterStream: async ({ context: { threadId, message, streamId }, stream }) => {
                await Promise.all([
                    generateThreadTitle(threadId, message.message),
                    streamContext.createNewResumableStream(streamId, () => stream),
                ]);
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
