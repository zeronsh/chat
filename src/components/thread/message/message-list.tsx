import { MessageItem } from '@/components/thread/message/message-item';
import { MultiModalInput } from '@/components/thread/multi-modal-input';
import { useThreadSelector } from '@/context/thread';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { StickToBottom, useStickToBottom } from 'use-stick-to-bottom';
import { Virtualizer } from 'virtua';

export function MessageList() {
    const messageIds = useThreadSelector(state => state.messageIds);
    const instance = useStickToBottom({
        initial: 'instant',
    });

    useAutoResume();

    return (
        <StickToBottom className="absolute top-0 left-0 right-0 bottom-4" instance={instance}>
            <Virtualizer as={StickToBottom.Content} scrollRef={instance.scrollRef}>
                {messageIds.map(id => (
                    <MessageItem key={id} id={id} />
                ))}
            </Virtualizer>
            <MultiModalInput />
        </StickToBottom>
    );
}
