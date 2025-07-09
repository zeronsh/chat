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
import { Fragment, memo, useMemo } from 'react';
import { customAlphabet } from 'nanoid';
import { ChatContainerRoot } from './container';
import { ChatContainerContent } from './container';

export const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    21
);

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
    experimental_throttle?: number;
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
    id: string;
};

type MessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    message: UIMessageWithMetaData;
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

type MessagesProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    messages: UIMessageWithMetaData[];
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
};

export function createChatComponent<
    Metadata = {},
    DataParts extends UIDataTypes = UIDataTypes,
    Tools extends UITools = never,
    UIMessageWithMetaData extends UIMessage<Metadata, DataParts, Tools> = UIMessage<
        Metadata,
        DataParts,
        Tools
    >,
>(options: {
    UserMessage: React.ComponentType<UserMessageProps<UIMessageWithMetaData>>;
    AssistantMessage: React.ComponentType<AssistantMessageProps<UIMessageWithMetaData>>;
    PendingMessage: React.ComponentType<PendingMessageProps>;
    PromptInput: React.ComponentType<PromptInputProps<UIMessageWithMetaData>>;
}) {
    const { UserMessage, AssistantMessage, PendingMessage, PromptInput } = options;

    const Messages = memo(function Messages(props: MessagesProps<UIMessageWithMetaData>) {
        return props.messages.map((message, i) => (
            <Message
                key={message.id}
                status={props.status}
                message={message}
                sendMessage={props.sendMessage}
                hasNextMessage={props.messages[i + 1] !== undefined}
                hasPreviousMessage={props.messages[i - 1] !== undefined}
            />
        ));
    });

    const Message = memo(function Message(props: MessageProps<UIMessageWithMetaData>) {
        const { status, message, sendMessage, hasNextMessage, hasPreviousMessage } = props;

        const children: React.ReactNode[] = [];

        if (message.role === 'assistant' && message.parts.length > 0) {
            children.push(
                <AssistantMessage
                    key={message.id}
                    status={status}
                    message={message}
                    sendMessage={sendMessage}
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            );
        }

        if (message.role === 'user') {
            children.push(
                <UserMessage
                    key={message.id}
                    status={status}
                    message={message}
                    sendMessage={sendMessage}
                    hasPreviousMessage={hasPreviousMessage}
                    hasNextMessage={true}
                />
            );
        }

        if (message.role === 'assistant' && message.parts.length === 0) {
            children.push(
                <PendingMessage
                    key="pending"
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            );
        }

        if (message.role === 'user' && !props.hasNextMessage) {
            children.push(
                <PendingMessage
                    key="pending"
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            );
        }

        return children;
    });

    return memo(function Chat(props: ChatProps<Metadata, DataParts, Tools, UIMessageWithMetaData>) {
        const generateId = props.generateId ?? nanoid;

        const id = useMemo(() => {
            if (props.id) {
                return props.id;
            }

            return generateId();
        }, [props.id, generateId]);

        const helpers = useChat<UIMessageWithMetaData>({
            id,
            generateId,
            experimental_throttle: props.experimental_throttle,
            messages: props.messages,
            transport: props.transport,
            onData: props.onData,
            onFinish: props.onFinish,
            onError: props.onError,
        });

        return (
            <ChatContainerRoot className={props.className}>
                <ChatContainerContent className={props.contentClassName}>
                    <Messages
                        status={helpers.status}
                        messages={helpers.messages}
                        sendMessage={helpers.sendMessage}
                    />
                </ChatContainerContent>
                <PromptInput
                    id={helpers.id}
                    status={helpers.status}
                    stop={helpers.stop}
                    sendMessage={helpers.sendMessage}
                />
            </ChatContainerRoot>
        );
    });
}
