import { serve } from 'bun';
import index from './index.html';
import { convertToModelMessages, createUIMessageStream, streamText, UIMessage } from 'ai';

const chat = {
    async POST(req: Bun.BunRequest<'/api/chat'>) {
        const body: { messages: UIMessage[] } = await req.json();
        const stream = createUIMessageStream({
            execute: ({ writer }) => {
                const result = streamText({
                    model: 'gpt-4o-mini',
                    messages: convertToModelMessages(body.messages),
                });

                result.consumeStream(writer);
                writer.merge(
                    result.toUIMessageStream({
                        sendReasoning: true,
                    })
                );
            },
        });

        return new Response(stream);
    },
};

const server = serve({
    routes: {
        '/*': index,
        '/api/chat': chat,
    },
    development: process.env.NODE_ENV !== 'production' && {
        hmr: true,
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
