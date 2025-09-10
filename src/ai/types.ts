import { AvailableTools } from '@/ai/tools';
import { DeepSearchPart } from '@/ai/tools/deep-search-tool';
import type { InferUITool, UIMessage, UIMessagePart } from 'ai';

export const Capabilities = {
    REASONING: 'reasoning',
    TOOLS: 'tools',
    VISION: 'vision',
    DOCUMENTS: 'documents',
} as const;

export type Capability = (typeof Capabilities)[keyof typeof Capabilities];

export type Metadata = {
    model?: {
        id: string;
        name: string;
        icon: string;
    };
};

export type DataParts = {
    error: string;
    'research-start': {
        toolCallId: string;
        thoughts: string;
    };
    'research-search': {
        toolCallId: string;
        thoughts: string;
        query: string;
    };
    'research-read': {
        toolCallId: string;
        thoughts: string;
        url: string;
    };
    'research-complete': {
        toolCallId: string;
    };
    'deep-search': DeepSearchPart;
};

export type Tools = {
    search: InferUITool<AvailableTools['search']>;
    research: InferUITool<AvailableTools['research']>;
    deepSearch: InferUITool<AvailableTools['deepSearch']>;
};

export type ThreadMessage = UIMessage<Metadata, DataParts, Tools>;

export type MessagePart = UIMessagePart<DataParts, Tools>;

export type DataKeys = Exclude<
    ThreadMessage['parts'][number]['type'],
    'reasoning' | 'step-start' | 'text' | 'source-url' | 'source-document' | 'file'
>;

export type ToolKeys = keyof Tools;
