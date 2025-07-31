import { tool } from 'ai';
import z from 'zod';
import { search } from '@/lib/exa';
import { decrementUsage, incrementUsage } from '@/ai/service';
import { Effect, Runtime } from 'effect';
import { ToolContext } from '@/ai/tools';

export const getSearchTool = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    return tool({
        description: 'Search the web for information',
        inputSchema: z.object({
            query: z.string(),
        }),
        execute: async ({ query }) => {
            const effect = Effect.gen(function* () {
                if (ctx.limits.SEARCH - (ctx.usage.search || 0) <= 0) {
                    yield* Effect.logWarning('Search limit reached');
                    return yield* Effect.die(null);
                }

                yield* Effect.logInfo('Running search for: ' + query);
                yield* Effect.tryPromise(() => incrementUsage(ctx.userId, 'search', 1)).pipe(
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
                        return Effect.tryPromise(() => decrementUsage(ctx.userId, 'search', 1));
                    }),
                    Effect.catchAll(e => Effect.die(e))
                );

                yield* Effect.logInfo('Search completed for: ' + query);

                return results;
            });

            return Runtime.runPromise(ctx.runtime, effect);
        },
    });
});
