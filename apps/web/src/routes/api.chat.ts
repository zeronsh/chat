import { createServerFileRoute } from '@tanstack/react-start/server';
import {
    UIMessage,
    createUIMessageStream,
    streamText,
    convertToModelMessages,
    JsonToSseTransformStream,
} from 'ai';

export const ServerRoute = createServerFileRoute('/api/chat').methods({
    async POST({ request }: { request: Request }) {
        const body: { messages: UIMessage[] } = await request.json();
        const stream = createUIMessageStream({
            execute: ({ writer }) => {
                const result = streamText({
                    model: 'gpt-4o-mini',
                    messages: convertToModelMessages(body.messages),
                    abortSignal: request.signal,
                });

                result.consumeStream();
                writer.merge(
                    result.toUIMessageStream({
                        sendReasoning: true,
                    })
                );
            },
        });

        return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    },
});
