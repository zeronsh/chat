import { MessageContainer } from '@/components/thread/message/message-container';
import { PendingMessage } from '@/components/thread/message/pending-message';
import { UIMessage } from '@/components/thread/message/ui-message';
import { UrlResultButton } from '@/components/thread/message/url-result-button';
import ModelIcon from '@/components/thread/model-icon';
import { Button } from '@/components/ui/button';
import { Message, MessageActions, MessageAction } from '@/components/ui/message';
import { useThreadContext, useThreadSelector } from '@/context/thread';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import { Fragment, memo } from 'react';
import { useAppStore } from '@/stores/app';
import { useThreadIdOrThrow } from '@/hooks/use-params-thread-id';

export const AssistantMessage = memo(function PureAssistantMessage({
    id,
    hasNextMessage,
    hasPreviousMessage,
}: {
    id: string;
    hasPreviousMessage: boolean;
    hasNextMessage: boolean;
}) {
    const threadId = useThreadIdOrThrow();
    const status = useAppStore(state => state.getThreadById(threadId)?.status);
    const length = useAppStore(state => state.getMessageById(threadId, id)?.parts.length);

    if (length === 0) {
        return (
            <MessageContainer
                className="justify-start"
                hasPreviousMessage={true}
                hasNextMessage={false}
            >
                <PendingMessage />
            </MessageContainer>
        );
    }

    return (
        <MessageContainer
            className="justify-start"
            hasPreviousMessage={hasPreviousMessage}
            hasNextMessage={hasNextMessage}
        >
            <Message className="flex flex-col items-start w-full">
                <UIMessage id={id} />
                {(status !== 'streaming' && status !== 'submitted') || hasNextMessage ? (
                    <Fragment>
                        {/* <ToolResultPills id={id} /> */}
                        <Actions id={id} />
                    </Fragment>
                ) : (
                    <MessageActions
                        className={cn('gap-1 transition-opacity duration-200 opacity-100')}
                    >
                        <Button variant="ghost" size="icon" className="size-8"></Button>
                    </MessageActions>
                )}
            </Message>
        </MessageContainer>
    );
});

const ToolResultPills = memo(function PureToolResultPills({ id }: { id: string }) {
    const toolSidebar = useThreadSelector(state => state.toolSidebar);
    const setToolSidebar = useThreadSelector(state => state.setToolSidebar);
    const searchResults = useThreadSelector(state =>
        state.messageMap[id].parts
            .filter(part => part.type === 'tool-search')
            .map(part => ({
                toolCallId: part.toolCallId,
                urls: part.output?.results.map(result => result.url) ?? [],
            }))
    );

    const researchResults = useThreadSelector(state =>
        state.messageMap[id].parts
            .filter(part => part.type === 'tool-research')
            .map(part => ({
                toolCallId: part.toolCallId,
                urls: state.messageMap[id].parts
                    .filter(p => p.type === 'data-research-read')
                    .filter(p => p.data.toolCallId === part.toolCallId)
                    .map(p => p.data.url),
            }))
    );

    if (searchResults.length === 0 && researchResults.length === 0) {
        return null;
    }

    return (
        <MessageActions>
            {researchResults.map(result => (
                <UrlResultButton
                    key={result.toolCallId}
                    urls={result.urls}
                    count={result.urls.length}
                    label="Sources Read"
                    onClick={() => {
                        if (
                            toolSidebar?.tool === 'research' &&
                            toolSidebar.toolCallId === result.toolCallId
                        ) {
                            setToolSidebar(undefined);
                        } else {
                            setToolSidebar({
                                tool: 'research',
                                toolCallId: result.toolCallId,
                                messageId: id,
                            });
                        }
                    }}
                />
            ))}
            {searchResults.map(result => (
                <UrlResultButton
                    key={result.toolCallId}
                    urls={result.urls}
                    count={result.urls.length}
                    label="Search Results"
                    onClick={() => {
                        if (
                            toolSidebar?.tool === 'search' &&
                            toolSidebar.toolCallId === result.toolCallId
                        ) {
                            setToolSidebar(undefined);
                        } else {
                            setToolSidebar({
                                tool: 'search',
                                toolCallId: result.toolCallId,
                                messageId: id,
                            });
                        }
                    }}
                />
            ))}
        </MessageActions>
    );
});

const Actions = memo(function PureActions({ id }: { id: string }) {
    const thread = useThreadContext();
    const threadId = useThreadIdOrThrow();
    const metadata = useAppStore(state => state.getMessageMetadataById(threadId, id));
    const status = useAppStore(state => state.getThreadById(threadId)?.status);
    return (
        <MessageActions className={cn('gap-1 transition-opacity duration-200 opacity-100')}>
            <MessageAction tooltip="Copy" side="bottom">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={async () => {
                        // await navigator.clipboard.writeText(
                        //     thread.store
                        //         .getState()
                        //         .messageMap[id].parts.filter(part => part.type === 'text')
                        //         .map(part => part.text)
                        //         .join('\n')
                        // );
                        toast.success('Copied to clipboard');
                    }}
                >
                    <CopyIcon className="size-3" />
                </Button>
            </MessageAction>
            <MessageAction tooltip="Regenerate" side="bottom">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    disabled={status === 'streaming' || status === 'submitted'}
                    onClick={() => {
                        thread.regenerate({ messageId: id });
                    }}
                >
                    <RefreshCcwIcon className="size-3" />
                </Button>
            </MessageAction>
            {metadata && metadata.model && (
                <Button variant="ghost" className="hover:bg-transparent! cursor-default" asChild>
                    <div>
                        <ModelIcon className="fill-primary" model={metadata.model.icon} />
                        <span className="text-xs text-muted-foreground font-normal">
                            {metadata.model.name}
                        </span>
                    </div>
                </Button>
            )}
        </MessageActions>
    );
});
