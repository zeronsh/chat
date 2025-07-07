import { useChat } from '@ai-sdk/react';
import type {
    UIMessage,
    UIDataTypes,
    UITools,
    ChatTransport,
    ChatOnDataCallback,
    ChatOnFinishCallback,
    ChatOnErrorCallback,
    IdGenerator,
} from 'ai';

type ChatProps<
    Metadata = {},
    DataParts extends UIDataTypes = UIDataTypes,
    Tools extends UITools = never,
    UIMessageWithMetaData extends UIMessage<Metadata, DataParts, Tools> = UIMessage<
        Metadata,
        DataParts,
        Tools
    >,
> = {
    className?: string;
    // AI SDK v5 props
    id?: string;
    generateId?: IdGenerator;
    messages: UIMessageWithMetaData[];
    transport: ChatTransport<UIMessageWithMetaData>;
    onData?: ChatOnDataCallback<UIMessageWithMetaData>;
    onFinish?: ChatOnFinishCallback<UIMessageWithMetaData>;
    onError?: ChatOnErrorCallback;

    // Component props
    UserMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
    }>;
    AssistantMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
    }>;
    PromptInput: React.ComponentType<{
        onSubmit: (message: string) => void;
    }>;
};

export function Chat<
    Metadata = {},
    DataParts extends UIDataTypes = UIDataTypes,
    Tools extends UITools = never,
    UIMessageWithMetaData extends UIMessage<Metadata, DataParts, Tools> = UIMessage<
        Metadata,
        DataParts,
        Tools
    >,
>(props: ChatProps<Metadata, DataParts, Tools, UIMessageWithMetaData>) {
    const helpers = useChat<UIMessageWithMetaData>({
        id: props.id,
        generateId: props.generateId,
        messages: props.messages,
        transport: props.transport,
        onData: props.onData,
        onFinish: props.onFinish,
        onError: props.onError,
    });

    return <div className={props.className}>Hello</div>;
}
