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
        description: 'Search the web for information',
        inputSchema: z.object({
            query: z.string(),
        }),
        execute: async ({ query }) => {
            return Runtime.runPromise(
                ctx.runtime,
                searchTool(query).pipe(
                    Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
                )
            );
        },
    });
});

function searchTool(query: string) {
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
            Effect.tapError(() => {
                return Effect.logError('Error incrementing usage');
            }),
            Effect.catchAll(e => Effect.die(e))
        );

        const results = yield* Effect.tryPromise(() => search(query)).pipe(
            Effect.tapError(() => {
                return Effect.logError('Error running search');
            }),
            Effect.tapError(() => {
                return Effect.all([
                    decrementUsage(ctx.userId, 'search', 1),
                    decrementUsage(ctx.userId, 'cost', SEARCH_COST),
                ]);
            }),
            Effect.catchAll(e => Effect.die(e))
        );

        yield* Effect.logInfo('Search completed for: ' + query);

        return results;
    });
}
