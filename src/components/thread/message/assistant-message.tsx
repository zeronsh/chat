import { MessageContainer } from '@/components/thread/message/message-container';
import { UIMessage } from '@/components/thread/message/ui-message';
import ModelIcon from '@/components/thread/model-icon';
import { Button } from '@/components/ui/button';
import { Message, MessageActions, MessageAction } from '@/components/ui/message';
import { useThreadSelector } from '@/context/thread';
import { cn } from '@/lib/utils';
import { CopyIcon, RefreshCcwIcon, GitBranchIcon } from 'lucide-react';
import { memo } from 'react';

export const AssistantMessage = memo(function PureAssistantMessage({
    id,
    hasNextMessage,
    hasPreviousMessage,
}: {
    id: string;
    hasPreviousMessage: boolean;
    hasNextMessage: boolean;
}) {
    const status = useThreadSelector(state => state.status);
    const metadata = useThreadSelector(
        state => state.messageMap[id].metadata,
        (a, b) => a?.model?.id === b?.model?.id
    );

    return (
        <MessageContainer
            className="justify-start"
            hasPreviousMessage={hasPreviousMessage}
            hasNextMessage={hasNextMessage}
        >
            <Message className="flex flex-col items-start w-full">
                <UIMessage id={id} />
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
                    {metadata && metadata.model && (
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent! cursor-default"
                            asChild
                        >
                            <div>
                                <ModelIcon className="fill-primary" model={metadata.model.icon} />
                                <span className="text-xs text-muted-foreground font-normal">
                                    {metadata.model.name}
                                </span>
                            </div>
                        </Button>
                    )}
                </MessageActions>
            </Message>
        </MessageContainer>
    );
});
