import { getResearchPrompt } from '@/ai/prompt';
import { ToolContext } from '.';
import { generateObject, generateText, NoSuchToolError, stepCountIs, tool } from 'ai';
import z from 'zod';
import { search, readSite } from '@/lib/exa';
import { DataParts } from '@/ai/types';
import { decrementUsage, incrementUsage } from '@/ai/service';
import { Effect, Layer, Runtime } from 'effect';

export const getResearchTool = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    return tool({
        description: 'Perfect deep research on given topic.',
        inputSchema: z.object({
            thoughts: z
                .string()
                .describe(
                    'Your thoughts on how you plan to research the given topic in 20-50 words.'
                ),
            prompt: z
                .string()
                .describe(
                    'This should be the users exact prompt. Do not infer or change it in any way.'
                ),
        }),
        execute: async ({ thoughts, prompt }, { toolCallId }) => {
            return Runtime.runPromise(
                ctx.runtime,
                researchTool(thoughts, prompt, toolCallId).pipe(
                    Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
                )
            );
        },
    });
});

function researchTool(thoughts: string, prompt: string, toolCallId: string) {
    return Effect.gen(function* () {
        const ctx = yield* ToolContext;

        if (ctx.limits.RESEARCH - (ctx.usage.research || 0) <= 0) {
            yield* Effect.logWarning('Research limit reached');
            return yield* Effect.die(null);
        }

        yield* incrementUsage(ctx.userId, 'research', 1).pipe(
            Effect.tapError(() => {
                return Effect.logError('Error incrementing usage');
            }),
            Effect.catchAll(e => Effect.die(e))
        );

        const actions: (DataParts['research-read'] | DataParts['research-search'])[] = [];

        ctx.writer.write({
            type: 'data-research-start',
            data: {
                toolCallId,
                thoughts,
            },
        });

        const { text: summary } = yield* Effect.tryPromise(() =>
            generateText({
                model: 'moonshotai/kimi-k2',
                prompt: getResearchPrompt(prompt),
                stopWhen: stepCountIs(50),
                tools: {
                    search: tool({
                        description: 'Search the web for information',
                        inputSchema: z.object({
                            thoughts: z
                                .string()
                                .describe(
                                    'Your thoughts on what you are currently doing in 20-50 words.'
                                ),
                            query: z.string(),
                        }),
                        execute: async ({ query, thoughts }) => {
                            ctx.writer.write({
                                type: 'data-research-search',
                                data: {
                                    toolCallId,
                                    thoughts,
                                    query,
                                },
                            });

                            actions.push({
                                toolCallId,
                                thoughts,
                                query,
                            });

                            return search(query);
                        },
                    }),
                    read_site: tool({
                        description: 'Read the contents of a URL',
                        inputSchema: z.object({
                            thoughts: z
                                .string()
                                .describe(
                                    'Your thoughts on what you are currently doing in 20-50 words.'
                                ),
                            url: z.string(),
                        }),
                        execute: async ({ url, thoughts }) => {
                            ctx.writer.write({
                                type: 'data-research-read',
                                data: { toolCallId, thoughts, url },
                            });

                            actions.push({
                                toolCallId,
                                thoughts,
                                url,
                            });

                            return readSite(url);
                        },
                    }),
                },
                // @ts-expect-error
                experimental_repairToolCall: async ({ error, toolCall, tools, inputSchema }) => {
                    if (NoSuchToolError.isInstance(error)) {
                        return null;
                    }

                    const tool = tools[toolCall.toolName as keyof typeof tools];

                    const { object: input } = await generateObject({
                        model: 'openai/gpt-4.1',
                        schema: tool.inputSchema,
                        prompt: [
                            `The model tried to call the tool "${toolCall.toolName}" with the following arguments:`,
                            JSON.stringify(toolCall.input),
                            `The tool accepts the following schema:`,
                            JSON.stringify(inputSchema(toolCall)),
                            'Please fix the arguments.',
                            `Today's date is ${new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}`,
                        ].join('\n'),
                    });

                    return {
                        ...toolCall,
                        input,
                    };
                },
            })
        ).pipe(
            Effect.tapError(e => {
                return Effect.logError('Error generating text', e);
            }),
            Effect.tapError(() => {
                return decrementUsage(ctx.userId, 'research', 1);
            }),
            Effect.catchAll(e => Effect.die(e))
        );

        ctx.writer.write({
            type: 'data-research-complete',
            data: { toolCallId },
        });

        return {
            summary,
            actions,
        };
    });
}
