import { getResearchTool } from '@/ai/tools/research-tool';
import { getSearchTool } from '@/ai/tools/search-tool';
import { ThreadMessage } from '@/ai/types';
import { Tool, UIMessageStreamWriter } from 'ai';

export type ToolContext = {
    writer: UIMessageStreamWriter<ThreadMessage>;
};

function getAvailableTools(ctx: ToolContext) {
    return {
        search: getSearchTool(ctx),
        research: getResearchTool(ctx),
    } as const;
}

export type AvailableTools = ReturnType<typeof getAvailableTools>;

export function getTools(ctx: ToolContext, tools: string[]) {
    const availableTools = getAvailableTools(ctx);

    return tools.reduce((acc, tool) => {
        if (availableTools[tool as keyof typeof availableTools]) {
            acc[tool as keyof typeof availableTools] =
                availableTools[tool as keyof typeof availableTools];
        }
        return acc;
    }, {} as Record<string, Tool>);
}
