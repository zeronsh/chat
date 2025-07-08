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
import { Fragment, memo } from 'react';

export type ChatProps<
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
    messages?: UIMessageWithMetaData[];
    transport?: ChatTransport<UIMessageWithMetaData>;
    onData?: ChatOnDataCallback<UIMessageWithMetaData>;
    onFinish?: ChatOnFinishCallback<UIMessageWithMetaData>;
    onError?: ChatOnErrorCallback;

    // Component props
    UserMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
    AssistantMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
    PendingMessage: React.ComponentType<{
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
    PromptInput: React.ComponentType<{
        stop: ReturnType<typeof useChat<UIMessageWithMetaData>>['stop'];
        sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
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

    const { PromptInput } = props;

    return (
        <div className={props.className}>
            <Messages
                messages={helpers.messages}
                UserMessage={props.UserMessage}
                AssistantMessage={props.AssistantMessage}
                PendingMessage={props.PendingMessage}
            />
            <PromptInput stop={helpers.stop} sendMessage={helpers.sendMessage} />
        </div>
    );
}

export type MessagesProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    messages: UIMessageWithMetaData[];
    UserMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
    AssistantMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
    PendingMessage: React.ComponentType<{
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
};

export const Messages = memo(function Messages<UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessagesProps<UIMessageWithMetaData>
) {
    return (
        <div>
            {props.messages.map((message, i) => (
                <Message
                    key={message.id}
                    message={message}
                    UserMessage={props.UserMessage}
                    AssistantMessage={props.AssistantMessage}
                    hasNextMessage={props.messages[i + 1] !== undefined}
                    hasPreviousMessage={props.messages[i - 1] !== undefined}
                    PendingMessage={props.PendingMessage}
                />
            ))}
        </div>
    );
}) as <UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessagesProps<UIMessageWithMetaData>
) => React.ReactElement;

export type MessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    message: UIMessageWithMetaData;
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
    UserMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
    AssistantMessage: React.ComponentType<{
        message: UIMessageWithMetaData;
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
    PendingMessage: React.ComponentType<{
        hasNextMessage: boolean;
        hasPreviousMessage: boolean;
    }>;
};

export const Message = memo(function Message<UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessageProps<UIMessageWithMetaData>
) {
    const {
        message,
        hasNextMessage,
        hasPreviousMessage,
        UserMessage,
        AssistantMessage,
        PendingMessage,
    } = props;

    if (message.role === 'assistant' && message.parts.length > 0) {
        return (
            <AssistantMessage
                message={message}
                hasNextMessage={hasNextMessage}
                hasPreviousMessage={hasPreviousMessage}
            />
        );
    }

    if (message.role === 'assistant' && message.parts.length === 0) {
        return (
            <PendingMessage
                hasNextMessage={hasNextMessage}
                hasPreviousMessage={hasPreviousMessage}
            />
        );
    }
    if (message.role === 'user' && !props.hasNextMessage) {
        return (
            <Fragment>
                <UserMessage
                    message={message}
                    hasPreviousMessage={hasPreviousMessage}
                    hasNextMessage={hasNextMessage}
                />
                <PendingMessage
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            </Fragment>
        );
    }

    return (
        <UserMessage
            message={message}
            hasPreviousMessage={hasPreviousMessage}
            hasNextMessage={hasNextMessage}
        />
    );
}) as <UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessageProps<UIMessageWithMetaData>
) => React.ReactElement;
