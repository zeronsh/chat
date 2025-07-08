import { MessagePart } from '@/components/chat/types';
import { MessageContent } from '@/components/ui/message';
import { match } from 'ts-pattern';

export function Part({ part }: { part: MessagePart }) {
    return match(part)
        .with({ type: 'text' }, ({ text }) => <MessageContent markdown>{text}</MessageContent>)
        .otherwise(() => null);
}
