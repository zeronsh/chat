import type { ThreadMessage } from '@/lib/types';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { convertToModelMessages } from 'ai';
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

                const { history, thread, message } = await prepareThread({
                    streamId,
                    userId: session.user.id,
                    threadId: body.id,
                    message: body.message,
                });

                return {
                    streamId,
                    threadId: thread.id,
                    userId: session.user.id,
                    message,
                    messages: convertToModelMessages(history),
                };
            },
            onStream: ({ context: { messages } }) => {
                return {
                    model: 'gpt-4o-mini',
                    messages,
                };
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
