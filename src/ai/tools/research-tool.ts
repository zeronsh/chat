import { getResearchPlanPrompt, getResearchPrompt } from '@/ai/prompt';
import { ToolContext } from '.';
import { generateObject, generateText, NoSuchToolError, stepCountIs, tool } from 'ai';
import z from 'zod';
import { search, readSite } from '@/lib/exa';
import { DataParts } from '@/ai/types';

export function getResearchTool(ctx: ToolContext) {
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
            const actions: (DataParts['research-read'] | DataParts['research-search'])[] = [];

            ctx.writer.write({
                type: 'data-research-start',
                data: {
                    toolCallId,
                    thoughts,
                },
            });

            const { text: summary } = await generateText({
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
            });

            ctx.writer.write({
                type: 'data-research-complete',
                data: { toolCallId },
            });

            return {
                summary,
                actions,
            };
        },
    });
}

export const planSchema = z.object({
    plan: z.array(
        z.object({
            title: z.string().min(10).max(70).describe('A title for the research topic'),
            todos: z
                .array(z.string())
                .min(3)
                .max(5)
                .describe('A list of what to research for the given title'),
        })
    ),
});

export type Plan = z.infer<typeof planSchema>['plan'];
