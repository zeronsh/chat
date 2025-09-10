import { getSearchTool } from '@/ai/tools/search-tool';
import { ThreadMessage } from '@/ai/types';
import { Tool, UIMessageStreamWriter } from 'ai';
import { schema } from '@/database/schema';
import { UserId } from '@/database/types';
import { Limits } from '@/lib/constants';
import { Effect, Runtime } from 'effect';
import { getResearchTool } from '@/ai/tools/research-tool';
import { Database } from '@/database/effect';
import { getDeepSearchTool } from '@/ai/tools/deep-search-tool';

const tools = {
    search: getSearchTool,
    research: getResearchTool,
    deepSearch: getDeepSearchTool,
} as const;

type ExtractTool<T> = T extends Effect.Effect<infer U, any, any> ? U : never;

export type AvailableTools = {
    [K in keyof typeof tools]: ExtractTool<(typeof tools)[K]>;
};

export type ToolContextImpl = {
    writer: UIMessageStreamWriter<ThreadMessage>;
    usage: typeof schema.usage.$inferSelect;
    userId: UserId;
    limits: Limits;
    runtime: Runtime.Runtime<Database>;
    tools: string[];
};

export class ToolContext extends Effect.Tag('ToolContext')<ToolContext, ToolContextImpl>() {}

export const getTools = Effect.gen(function* () {
    const ctx = yield* ToolContext;

    const activeTools: Record<string, Tool> = {};

    for (const tool of ctx.tools) {
        activeTools[tool] = yield* tools[tool as keyof typeof tools];
    }

    return activeTools;
});
