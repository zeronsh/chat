import { tool } from 'ai';
import { ToolContext } from '.';
import z from 'zod';
import { search } from '@/lib/exa';

export function getSearchTool(ctx: ToolContext) {
    return tool({
        description: 'Search the web for information',
        inputSchema: z.object({
            query: z.string(),
        }),
        execute: async ({ query }) => {
            return search(query);
        },
    });
}
