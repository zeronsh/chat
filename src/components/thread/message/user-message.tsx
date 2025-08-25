import { FileAttachment } from '@/components/thread/file-attachment';
import { MessageContainer } from '@/components/thread/message/message-container';
import { PendingMessage } from '@/components/thread/message/pending-message';
import { UIMessage } from '@/components/thread/message/ui-message';
import { Button } from '@/components/ui/button';
import { Message, MessageActions, MessageAction } from '@/components/ui/message';
import { useThreadSelector } from '@/context/thread';
import { CopyIcon, EditIcon } from 'lucide-react';
import { Fragment, memo, useMemo } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

export const UserMessage = memo(function PureUserMessage({
    id,
    hasPreviousMessage,
    hasNextMessage,
}: {
    id: string;
    hasPreviousMessage: boolean;
    hasNextMessage: boolean;
}) {
    const [_, copy] = useCopyToClipboard();
    const message = useThreadSelector(state => state.messageMap[id]);
    const setEditingMessageId = useThreadSelector(state => state.setEditingMessageId);
    const setInput = useThreadSelector(state => state.setInput);
    const setAttachments = useThreadSelector(state => state.setAttachments);

    async function handleCopyClick() {
        const text = message.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join('\n')
            ?.trim();

        if (!text) {
            return;
        }

        await copy(text);
        toast.success('Copied to clipboard');
    }

    const fileParts = useMemo(() => {
        return message.parts.filter(part => part.type === 'file');
    }, [message.parts]);

    function handleEditClick() {
        setEditingMessageId(id);
        setInput(
            message.parts
                .filter(part => part.type === 'text')
                .map(part => part.text)
                .join('\n')
        );
        setAttachments(
            fileParts.map(part => ({
                type: 'file',
                url: part.url,
                filename: part.filename || 'untitled',
                mediaType: part.mediaType,
            }))
        );
    }

    return (
        <Fragment>
            <MessageContainer hasPreviousMessage={hasPreviousMessage} hasNextMessage={true}>
                <Message className="flex flex-col items-end group/user-message w-full">
                    {fileParts.length > 0 && (
                        <div className="flex items-end gap-2">
                            {fileParts.map((part, index) => (
                                <FileAttachment
                                    key={index}
                                    url={part.url}
                                    name={part.filename}
                                    mediaType={part.mediaType}
                                />
                            ))}
                        </div>
                    )}
                    <div className="bg-muted py-3 px-4 rounded-l-3xl rounded-tr-3xl rounded-br-lg max-w-[80%] border border-foreground/10">
                        <UIMessage id={message.id} />
                    </div>
                    <MessageActions className="group-hover/user-message:opacity-100 md:opacity-0 transition-opacity duration-200 gap-1">
                        <MessageAction tooltip="Copy" side="bottom">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={handleCopyClick}
                            >
                                <CopyIcon className="size-3" />
                            </Button>
                        </MessageAction>
                        <MessageAction tooltip="Edit" side="bottom">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={handleEditClick}
                            >
                                <EditIcon className="size-3" />
                            </Button>
                        </MessageAction>
                    </MessageActions>
                </Message>
            </MessageContainer>
            {!hasNextMessage && (
                <MessageContainer
                    className="justify-end"
                    hasPreviousMessage={true}
                    hasNextMessage={false}
                >
                    <PendingMessage />
                </MessageContainer>
            )}
        </Fragment>
    );
});
