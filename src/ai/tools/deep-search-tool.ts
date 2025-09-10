import { Effect, Layer, Runtime } from 'effect';
import { generateObject, generateText, NoSuchToolError, stepCountIs, tool } from 'ai';
import z from 'zod';
import { decrementUsage, incrementUsage } from '@/ai/service';
import { ToolContext } from '@/ai/tools';
import { getDeepSearchPlanPrompt, getDeepSearchPrompt } from '@/ai/prompt';
import { readSite, search, SearchResults } from '@/lib/exa';

const PlanTodo = z.string().min(10).max(300);

const PlanSchema = z.object({
    plan: z.array(PlanTodo).min(1).max(8),
});

export type Plan = z.infer<typeof PlanSchema>['plan'];

export type DeepSearchStart = {
    type: 'start';
    timestamp: number;
    thoughts: string;
};

export type DeepSearchComplete = {
    type: 'completed';
    timestamp: number;
};

export type DeepSearchPlan = {
    type: 'plan';
};

export type DeepSearchPlanResults = {
    type: 'plan-results';
    plan: Plan;
};

export type DeepSearchSearch = {
    type: 'search';
    thoughts: string;
    query: string;
};

export type DeepSearchSearchResults = {
    type: 'search-results';
    query: string;
    results: SearchResults['results'];
};

export type DeepSearchReadSite = {
    type: 'read-site';
    thoughts: string;
    url: string;
};

export type DeepSearchReadSiteResults = {
    type: 'read-site-results';
    url: string;
    content: string;
};

export type DeepSearchPartUnion =
    | DeepSearchStart
    | DeepSearchComplete
    | DeepSearchPlan
    | DeepSearchPlanResults
    | DeepSearchSearch
    | DeepSearchSearchResults
    | DeepSearchReadSite
    | DeepSearchReadSiteResults;

export type DeepSearchPart = {
    toolCallId: string;
} & DeepSearchPartUnion;

export const getDeepSearchTool = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    return tool({
        name: 'Deep Search',
        description: 'Performs deep search on a given topic',
        inputSchema: z.object({
            query: z.string().min(1).max(300).describe('The query to perform deep search on.'),
            thoughts: z
                .string()
                .min(1)
                .max(300)
                .describe('Your thoughts on how you plan to approach the search in 20-50 words.'),
        }),
        execute: ({ query, thoughts }, { toolCallId }) => {
            return Runtime.runPromise(
                ctx.runtime,
                deepSearchTool({ query, thoughts, toolCallId }).pipe(
                    Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
                )
            );
        },
    });
});

function deepSearchTool(args: { query: string; thoughts: string; toolCallId: string }) {
    return Effect.gen(function* () {
        const ctx = yield* ToolContext;

        yield* incrementResearchUsageOrDie();

        const steps: DeepSearchPartUnion[] = [];

        function commit(step: DeepSearchPartUnion) {
            steps.push(step);
            ctx.writer.write({
                type: 'data-deep-search',
                data: {
                    toolCallId: args.toolCallId,
                    ...step,
                },
            });
        }

        commit({ type: 'start', thoughts: args.thoughts, timestamp: Date.now() });
        commit({ type: 'plan' });

        const {
            object: { plan },
        } = yield* Effect.tryPromise(() =>
            generateObject({
                model: 'xai/grok-code-fast-1',
                schema: PlanSchema,
                prompt: getDeepSearchPlanPrompt(args.query),
                abortSignal: ctx.signal,
            })
        ).pipe(
            Effect.tapError(e => {
                return Effect.logError('Error generating plan', e);
            }),
            Effect.tapError(() => {
                return decrementUsage(ctx.userId, 'research', 1);
            }),
            Effect.catchAll(e => Effect.die(e))
        );

        commit({ type: 'plan-results', plan });

        const { text: summary } = yield* Effect.tryPromise(() =>
            generateText({
                model: 'moonshotai/kimi-k2',
                prompt: getDeepSearchPrompt(args.query, plan),
                stopWhen: stepCountIs(50),
                abortSignal: ctx.signal,
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
                            commit({ type: 'search', query, thoughts });
                            const response = await search(query);
                            commit({ type: 'search-results', query, results: response.results });
                            return response;
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
                            commit({ type: 'read-site', url, thoughts });
                            const response = await readSite(url);
                            commit({ type: 'read-site-results', url, content: response.text });
                            return response;
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

        commit({ type: 'completed', timestamp: Date.now() });

        return {
            steps,
            summary,
        };
    });
}

function incrementResearchUsageOrDie() {
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
    });
}
