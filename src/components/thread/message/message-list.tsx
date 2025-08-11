import { MessageItem } from '@/components/thread/message/message-item';
import { MultiModalInput } from '@/components/thread/multi-modal-input';
import { ZList } from '@/components/ui/z-list';
import { useThreadContext, useThreadSelector } from '@/context/thread';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { StickToBottom, useStickToBottom } from 'use-stick-to-bottom';

export function MessageList() {
    const thread = useThreadContext();
    const messageIds = useThreadSelector(state => state.messageIds);
    const instance = useStickToBottom({
        initial: 'instant',
    });

    useAutoResume();

    return (
        <StickToBottom className="absolute top-0 left-0 right-0 bottom-4" instance={instance}>
            <ZList
                className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                data={messageIds}
                getItemKey={id => id}
                renderItem={({ item }) => <MessageItem id={item} />}
                estimateSize={({ item }) => {
                    const message = thread.store.getState().messageMap[item];
                    if (!message) {
                        return 300;
                    }
                    const text = message.parts.reduce((acc, part) => {
                        return acc + (part.type === 'text' ? part.text : '');
                    }, '');
                    const lines = text.split('\n').length;
                    return lines * 32;
                }}
                instance={instance}
            />
            <MultiModalInput />
        </StickToBottom>
    );
}
