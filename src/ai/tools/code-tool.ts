import { streamObject, tool } from 'ai';
import z from 'zod';
import { Effect, Layer, Runtime, Stream } from 'effect';
import { ToolContext } from '@/ai/tools';
import { getCodePrompt } from '@/ai/prompt';
import { Sandbox } from '@e2b/code-interpreter';

export const getCodeTool = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    return tool({
        description: "Generate and run code based on the user's request",
        inputSchema: z.object({
            prompt: z
                .string()
                .describe(
                    'The prompt to generate code for. Include all the details and context needed to generate the code.'
                ),
        }),
        execute: async ({ prompt }, { toolCallId }) => {
            return Runtime.runPromise(
                ctx.runtime,
                codeTool(prompt, toolCallId).pipe(
                    Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
                )
            );
        },
    });
});

function codeTool(prompt: string, toolCallId: string) {
    return Effect.gen(function* () {
        const ctx = yield* ToolContext;

        yield* Effect.logInfo('Running code tool for: ' + prompt);

        const { fullStream } = streamObject({
            model: 'moonshotai/kimi-k2',
            system: getCodePrompt(),
            prompt,
            schema: z.object({
                code: z.string(),
            }),
            providerOptions: {
                gateway: {
                    order: ['groq', 'cerebras'],
                },
            },
        });

        const stream = Stream.fromAsyncIterable(fullStream, () => {});

        let content = '';

        let streamDelta = '';

        yield* stream.pipe(
            Stream.tap(delta => {
                const { type } = delta;

                if (type === 'object') {
                    const { object } = delta;
                    const { code } = object;

                    if (code) {
                        const codeDelta = code.replace(content, '');
                        streamDelta += codeDelta;

                        if (streamDelta.includes('\n')) {
                            ctx.writer.write({
                                type: 'data-code-delta',
                                data: {
                                    toolCallId,
                                    delta: streamDelta,
                                },
                            });
                            streamDelta = '';
                        }

                        content = code;
                    }
                }

                return Effect.succeed(null);
            }),
            Stream.runCollect
        );

        const results = yield* Effect.tryPromise(async () => {
            const sbx = await Sandbox.create();
            const execution = await sbx.runCode(content);

            if (execution.error) {
                console.log(execution.error);
            }

            return execution;
        }).pipe(
            Effect.tapError(() => {
                return Effect.logError('Error running code tool');
            }),
            Effect.catchAll(e => Effect.succeed([]))
        );

        yield* Effect.logInfo('Code tool completed for: ' + prompt);

        return {
            code: content,
            results,
        };
    });
}
