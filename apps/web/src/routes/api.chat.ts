import type { ThreadMessage } from '@/components/chat/types';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { convertToModelMessages } from 'ai';
import { createUIMessageStreamResponse } from '@zeronsh/ai';
import z from 'zod';

export const ServerRoute = createServerFileRoute('/api/chat').methods({
    async POST({ request }: { request: Request }) {
        return createUIMessageStreamResponse<ThreadMessage>()({
            request,
            schema: z.object({
                messages: z.any(),
            }),
            onPrepare: async ({ body }) => {
                return {
                    messages: convertToModelMessages(body.messages),
                };
            },
            onStream: ({ context: { messages } }) => {
                return {
                    model: 'gpt-4o-mini',
                    messages,
                };
            },
        });
    },
});
