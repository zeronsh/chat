import { MessageItem } from '@/components/thread/message/message-item';
import { MultiModalInput } from '@/components/thread/multi-modal-input';
import { useThreadSelector } from '@/context/thread';
import { StickToBottom } from 'use-stick-to-bottom';

export function MessageList() {
    const messageIds = useThreadSelector(state => state.messageIds);

    return (
        <StickToBottom className="absolute inset-0 bottom-4 overflow-y-auto" initial="instant">
            <StickToBottom.Content className="flex flex-col gap-4 px-4 mx-auto max-w-3xl w-full">
                {messageIds.map(id => (
                    <MessageItem key={id} id={id} />
                ))}
            </StickToBottom.Content>
            <MultiModalInput />
        </StickToBottom>
    );
}
