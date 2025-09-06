import { Effect, Layer, Runtime } from 'effect';
import { tool } from 'ai';
import z from 'zod';
import { incrementUsage } from '@/ai/service';
import { ToolContext } from '@/ai/tools';

export const getDeepSearchTool = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    return tool({
        name: 'Deep Search',
        description: 'Performs deep search on a given topic',
        inputSchema: z.object({
            query: z.string().min(1).max(200).describe('The query to perform deep search on.'),
            thoughts: z
                .string()
                .min(1)
                .max(200)
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
        yield* incrementResearchUsageOrDie();
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
