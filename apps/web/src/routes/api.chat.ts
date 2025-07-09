import type { ThreadMessage } from '@/lib/types';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { convertToModelMessages } from 'ai';
import { createUIMessageStreamResponse } from '@zeronsh/ai';
import z from 'zod';
import { auth } from '@/lib/auth';
import { ThreadError } from '@/lib/error';
import { generateThreadTitle, prepareThread, saveMessageAndResetThreadStatus } from '@/lib/chat';

export const ServerRoute = createServerFileRoute('/api/chat').methods({
    async POST({ request }: { request: Request }) {
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

                const { history, thread, message } = await prepareThread({
                    userId: session.user.id,
                    threadId: body.id,
                    nextMessageId: body.message.id,
                    message: body.message,
                });

                return {
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
            onAfterStream: async ({ context: { threadId, message } }) => {
                await generateThreadTitle(threadId, message.message);
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
