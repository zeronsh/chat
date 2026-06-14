import { tool } from 'ai';
import z from 'zod';
import { readSite } from '@/lib/exa';
import { decrementUsage, incrementUsage } from '@/ai/service';
import { READ_SITE_COST } from '@/lib/constants';
import { Effect, Layer, Runtime } from 'effect';
import { ToolContext } from '@/ai/tools';

export const getReadSiteTool = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    return tool({
        description: [
            'Read the full contents of a web page by URL.',
            'Use this after search to read a promising result in full, or any time you have a',
            'specific URL whose contents you need. Returns the page title, a summary, and the',
            '(trimmed) page text. Prefer reading a source before citing it.',
        ].join(' '),
        inputSchema: z.object({
            url: z.string().url().describe('The full URL of the page to read.'),
        }),
        execute: async ({ url }) => {
            return Runtime.runPromise(
                ctx.runtime,
                readSiteTool(url).pipe(
                    Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
                )
            );
        },
    });
});

function readSiteTool(url: string) {
    return Effect.gen(function* () {
        const ctx = yield* ToolContext;

        if (ctx.limits.BUDGET - (ctx.usage.cost || 0) <= 0) {
            yield* Effect.logWarning('Daily usage limit reached');
            return yield* Effect.die(null);
        }

        yield* Effect.logInfo('Reading site: ' + url);
        yield* incrementUsage(ctx.userId, 'cost', READ_SITE_COST).pipe(
            Effect.tapError(() => Effect.logError('Error incrementing usage')),
            Effect.catchAll(e => Effect.die(e))
        );

        const result = yield* Effect.tryPromise(() => readSite(url)).pipe(
            Effect.tapError(() => Effect.logError('Error reading site')),
            Effect.tapError(() => decrementUsage(ctx.userId, 'cost', READ_SITE_COST)),
            Effect.catchAll(e => Effect.die(e))
        );

        yield* Effect.logInfo('Read site completed: ' + url);

        return result;
    });
}
