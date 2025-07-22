import { AssistantMessage } from '@/components/thread/message/assistant-message';
import { UserMessage } from '@/components/thread/message/user-message';
import { useThreadSelector } from '@/context/thread';
import { memo } from 'react';

export const MessageItem = memo(
    function PureMessageItem({ id }: { id: string }) {
        const role = useThreadSelector(state => state.messageMap[id].role);
        const hasNextMessage = useThreadSelector(
            state => state.messageIds[state.messageIds.indexOf(id) + 1] !== undefined
        );
        const hasPreviousMessage = useThreadSelector(
            state => state.messageIds[state.messageIds.indexOf(id) - 1] !== undefined
        );

        if (role === 'assistant') {
            return (
                <AssistantMessage
                    id={id}
                    hasPreviousMessage={hasPreviousMessage}
                    hasNextMessage={hasNextMessage}
                />
            );
        }

        return (
            <UserMessage
                id={id}
                hasPreviousMessage={hasPreviousMessage}
                hasNextMessage={hasNextMessage}
            />
        );
    },
    (prev, next) => prev.id === next.id
);
