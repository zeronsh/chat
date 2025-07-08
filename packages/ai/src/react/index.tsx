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
import { StickToBottom, type StickToBottomProps } from 'use-stick-to-bottom';

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
    contentClassName?: string;
    // AI SDK v5 props
    id?: string;
    generateId?: IdGenerator;
    messages?: UIMessageWithMetaData[];
    transport?: ChatTransport<UIMessageWithMetaData>;
    onData?: ChatOnDataCallback<UIMessageWithMetaData>;
    onFinish?: ChatOnFinishCallback<UIMessageWithMetaData>;
    onError?: ChatOnErrorCallback;

    // Component props
    UserMessage: React.ComponentType<UserMessageProps<UIMessageWithMetaData>>;
    AssistantMessage: React.ComponentType<AssistantMessageProps<UIMessageWithMetaData>>;
    PendingMessage: React.ComponentType<PendingMessageProps>;
    PromptInput: React.ComponentType<PromptInputProps<UIMessageWithMetaData>>;
};

export type UserMessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    message: UIMessageWithMetaData;
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type AssistantMessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    message: UIMessageWithMetaData;
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type PendingMessageProps = {
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type PromptInputProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    stop: ReturnType<typeof useChat<UIMessageWithMetaData>>['stop'];
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
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
        <ChatContainerRoot className={props.className}>
            <ChatContainerContent className={props.contentClassName}>
                <Messages
                    status={helpers.status}
                    messages={helpers.messages}
                    UserMessage={props.UserMessage}
                    AssistantMessage={props.AssistantMessage}
                    PendingMessage={props.PendingMessage}
                    sendMessage={helpers.sendMessage}
                />
            </ChatContainerContent>
            <PromptInput
                status={helpers.status}
                stop={helpers.stop}
                sendMessage={helpers.sendMessage}
            />
        </ChatContainerRoot>
    );
}

export type MessagesProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    messages: UIMessageWithMetaData[];
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    UserMessage: React.ComponentType<UserMessageProps<UIMessageWithMetaData>>;
    AssistantMessage: React.ComponentType<AssistantMessageProps<UIMessageWithMetaData>>;
    PendingMessage: React.ComponentType<PendingMessageProps>;
};

export const Messages = memo(function Messages<UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessagesProps<UIMessageWithMetaData>
) {
    return props.messages.map((message, i) => (
        <Message
            key={message.id}
            status={props.status}
            message={message}
            sendMessage={props.sendMessage}
            UserMessage={props.UserMessage}
            AssistantMessage={props.AssistantMessage}
            hasNextMessage={props.messages[i + 1] !== undefined}
            hasPreviousMessage={props.messages[i - 1] !== undefined}
            PendingMessage={props.PendingMessage}
        />
    ));
}) as <UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessagesProps<UIMessageWithMetaData>
) => React.ReactElement;

export type MessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    message: UIMessageWithMetaData;
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
    UserMessage: React.ComponentType<UserMessageProps<UIMessageWithMetaData>>;
    AssistantMessage: React.ComponentType<AssistantMessageProps<UIMessageWithMetaData>>;
    PendingMessage: React.ComponentType<PendingMessageProps>;
};

export const Message = memo(function Message<UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessageProps<UIMessageWithMetaData>
) {
    const {
        status,
        message,
        sendMessage,
        hasNextMessage,
        hasPreviousMessage,
        UserMessage,
        AssistantMessage,
        PendingMessage,
    } = props;

    if (message.role === 'assistant' && message.parts.length > 0) {
        return (
            <AssistantMessage
                status={status}
                message={message}
                sendMessage={sendMessage}
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
                    status={status}
                    message={message}
                    sendMessage={sendMessage}
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
            status={status}
            message={message}
            sendMessage={sendMessage}
            hasPreviousMessage={hasPreviousMessage}
            hasNextMessage={hasNextMessage}
        />
    );
}) as <UIMessageWithMetaData extends UIMessage = UIMessage>(
    props: MessageProps<UIMessageWithMetaData>
) => React.ReactElement;

export type ChatContainerRootProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement> &
    StickToBottomProps;

export type ChatContainerContentProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps = {
    className?: string;
    ref?: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export function ChatContainerRoot({ children, className, ...props }: ChatContainerRootProps) {
    return (
        <StickToBottom className={className} role="log" {...props}>
            {children}
        </StickToBottom>
    );
}

export function ChatContainerContent({ children, className, ...props }: ChatContainerContentProps) {
    return (
        <StickToBottom.Content className={className} {...props}>
            {children}
        </StickToBottom.Content>
    );
}

export function ChatContainerScrollAnchor({ className, ...props }: ChatContainerScrollAnchorProps) {
    return <div className={className} aria-hidden="true" {...props} />;
}
