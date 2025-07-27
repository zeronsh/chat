import { tool } from 'ai';
import { ToolContext } from '.';
import z from 'zod';
import { search } from '@/lib/exa';
import { decrementUsage, incrementUsage } from '@/ai/service';

export function getSearchTool(ctx: ToolContext) {
    return tool({
        description: 'Search the web for information',
        inputSchema: z.object({
            query: z.string(),
        }),
        execute: async ({ query }) => {
            try {
                if (ctx.limits.SEARCH - (ctx.usage.search || 0) <= 0) {
                    throw new Error('LIMIT_REACHED');
                }

                await incrementUsage(ctx.userId, 'search', 1);
                return search(query);
            } catch (error) {
                if (Error.isError(error) && error.message === 'LIMIT_REACHED') {
                    throw error;
                }
                await decrementUsage(ctx.userId, 'search', 1);
                throw error;
            }
        },
    });
}
