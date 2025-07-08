import type { UIMessage } from 'ai';
import { Part } from './part';
import type { AssistantMessageProps, UserMessageProps } from '@zeronsh/ai/react';
import { Message, MessageAction, MessageActions } from '@/components/ui/message';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { CopyIcon, EditIcon, GitBranchIcon, RefreshCcwIcon } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import type { ThreadMessage } from '@/components/chat/types';

export function UserMessage({
    message,
    hasPreviousMessage,
    hasNextMessage,
}: UserMessageProps<ThreadMessage>) {
    const [_, copy] = useCopyToClipboard();
    return (
        <MessageContainer hasPreviousMessage={hasPreviousMessage} hasNextMessage={hasNextMessage}>
            <Message className="flex flex-col items-end group/user-message w-full">
                <div className="bg-muted p-4 rounded-l-3xl rounded-tr-3xl rounded-br-lg max-w-[80%]">
                    <UIMessage message={message} />
                </div>
                <MessageActions className="group-hover/user-message:opacity-100 md:opacity-0 transition-opacity duration-200 gap-1">
                    <MessageAction tooltip="Copy" side="bottom">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={async () => {
                                const text = message.parts
                                    .filter(part => part.type === 'text')
                                    .map(part => part.text)
                                    .join('\n')
                                    .trim();

                                if (!text) {
                                    return;
                                }

                                await copy(text);
                            }}
                        >
                            <CopyIcon className="size-3" />
                        </Button>
                    </MessageAction>
                    <MessageAction tooltip="Edit" side="bottom">
                        <Button variant="ghost" size="icon" className="size-8">
                            <EditIcon className="size-3" />
                        </Button>
                    </MessageAction>
                </MessageActions>
            </Message>
        </MessageContainer>
    );
}

export function AssistantMessage({
    status,
    message,
    hasNextMessage,
    hasPreviousMessage,
}: AssistantMessageProps<ThreadMessage>) {
    return (
        <MessageContainer
            className="justify-start"
            hasPreviousMessage={hasPreviousMessage}
            hasNextMessage={hasNextMessage}
        >
            <Message className="flex flex-col items-start w-full">
                <UIMessage message={message} />
                <MessageActions
                    className={cn(
                        'gap-1 transition-opacity duration-200 opacity-100',
                        (status === 'streaming' || status === 'submitted') &&
                            !hasNextMessage &&
                            'opacity-0 pointer-events-none'
                    )}
                >
                    <MessageAction tooltip="Copy" side="bottom">
                        <Button variant="ghost" size="icon" className="size-8">
                            <CopyIcon className="size-3" />
                        </Button>
                    </MessageAction>
                    <MessageAction tooltip="Regenerate" side="bottom">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={status === 'streaming' || status === 'submitted'}
                        >
                            <RefreshCcwIcon className="size-3" />
                        </Button>
                    </MessageAction>
                    <MessageAction tooltip="Branch" side="bottom">
                        <Button variant="ghost" size="icon" className="size-8">
                            <GitBranchIcon className="size-3" />
                        </Button>
                    </MessageAction>
                </MessageActions>
            </Message>
        </MessageContainer>
    );
}

export function PendingMessage({
    hasPreviousMessage,
    hasNextMessage,
}: {
    hasPreviousMessage: boolean;
    hasNextMessage: boolean;
}) {
    return (
        <MessageContainer hasPreviousMessage={hasPreviousMessage} hasNextMessage={hasNextMessage}>
            <Message>
                <Loader variant="typing" />
            </Message>
        </MessageContainer>
    );
}

function UIMessage({ message }: { message: ThreadMessage }) {
    return message.parts.map((part, i) => <Part key={i} part={part} />);
}

function MessageContainer({
    children,
    hasPreviousMessage,
    hasNextMessage,
    className,
}: {
    children: React.ReactNode;
    hasPreviousMessage: boolean;
    hasNextMessage: boolean;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex w-full',
                className,
                !hasNextMessage && 'pb-40',
                !hasPreviousMessage && 'pt-40'
            )}
        >
            {children}
        </div>
    );
}
