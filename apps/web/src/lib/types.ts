import type { UIMessage, UIMessagePart } from 'ai';

export const Capabilities = {
    REASONING: 'reasoning',
    TOOLS: 'tools',
    VISION: 'vision',
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
};

export type Tools = {};

export type ThreadMessage = UIMessage<Metadata, DataParts, Tools>;
export type MessagePart = UIMessagePart<DataParts, Tools>;
