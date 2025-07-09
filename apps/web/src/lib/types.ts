import type { UIMessage, UIMessagePart } from 'ai';

export type Metadata = {
    modelId: string;
    modelIcon: string;
    modelName: string;
};

export type DataParts = {};

export type Tools = {};

export type ThreadMessage = UIMessage<Metadata, DataParts, Tools>;
export type MessagePart = UIMessagePart<DataParts, Tools>;
