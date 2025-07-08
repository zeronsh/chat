import type { UIMessage, UIMessagePart } from 'ai';

export type Metadata = {
    modelId: string;
    modelIcon: string;
    modelName: string;
};

export type DataParts = {};

export type ThreadMessage = UIMessage<Metadata, DataParts, any>;
export type MessagePart = UIMessagePart<DataParts, any>;
