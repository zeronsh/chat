import { tool } from 'ai';
import z from 'zod';
import { search } from '@/lib/exa';
import { decrementUsage, incrementUsage } from '@/ai/service';
import { SEARCH_COST } from '@/lib/constants';
import { Effect, Layer, Runtime } from 'effect';
import { ToolContext } from '@/ai/tools';

export const getSearchTool = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    return tool({
        description: [
            'Search the web for current, factual information.',
            'Use this whenever the answer depends on recent events, specific facts, prices,',
            'documentation, or anything you are not certain about from memory.',
            'Returns ranked results with a title, url, and summary for each.',
            'Follow up with the read_site tool to read a result in full before relying on it,',
            'and cite the sources you use inline as markdown links, e.g. [[1]](url).',
        ].join(' '),
        inputSchema: z.object({
            query: z
                .string()
                .describe('A focused search query, 3-12 words. Prefer specific terms and proper nouns.'),
            numResults: z
                .number()
                .int()
                .min(1)
                .max(10)
                .optional()
                .describe('How many results to return (default 6).'),
        }),
        execute: async ({ query, numResults }) => {
            return Runtime.runPromise(
                ctx.runtime,
                searchTool(query, numResults).pipe(
                    Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
                )
            );
        },
    });
});

function searchTool(query: string, numResults?: number) {
    return Effect.gen(function* () {
        const ctx = yield* ToolContext;

        if (ctx.limits.BUDGET - (ctx.usage.cost || 0) <= 0) {
            yield* Effect.logWarning('Daily usage limit reached');
            return yield* Effect.die(null);
        }

        yield* Effect.logInfo('Running search for: ' + query);
        yield* Effect.all([
            incrementUsage(ctx.userId, 'search', 1),
            incrementUsage(ctx.userId, 'cost', SEARCH_COST),
        ]).pipe(
            Effect.tapError(() => Effect.logError('Error incrementing usage')),
            Effect.catchAll(e => Effect.die(e))
        );

        const results = yield* Effect.tryPromise(() => search(query, numResults)).pipe(
            Effect.tapError(() => Effect.logError('Error running search')),
            Effect.tapError(() =>
                Effect.all([
                    decrementUsage(ctx.userId, 'search', 1),
                    decrementUsage(ctx.userId, 'cost', SEARCH_COST),
                ])
            ),
            Effect.catchAll(e => Effect.die(e))
        );

        yield* Effect.logInfo('Search completed for: ' + query);

        return results;
    });
}
