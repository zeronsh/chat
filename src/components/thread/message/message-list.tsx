import { MessageItem } from '@/components/thread/message/message-item';
import { MultiModalInput } from '@/components/thread/multi-modal-input';
import { ZList } from '@/components/ui/z-list';
import { useThreadSelector } from '@/context/thread';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { StickToBottom, useStickToBottom } from 'use-stick-to-bottom';

export function MessageList() {
    const messageIds = useThreadSelector(state => state.messageIds);
    const instance = useStickToBottom({
        initial: 'instant',
    });

    useAutoResume();

    return (
        <StickToBottom
            className="absolute top-0 left-0 right-0 bottom-4"
            instance={instance}
            initial="instant"
        >
            <ZList
                className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                data={messageIds}
                getItemKey={id => id}
                renderItem={({ item }) => <MessageItem id={item} />}
                instance={instance}
            />
            <MultiModalInput />
        </StickToBottom>
    );
}
