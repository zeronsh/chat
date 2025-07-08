import { MessageContent } from '@/components/ui/message';
import { UIMessagePart } from 'ai';
import { match } from 'ts-pattern';

export function Part({ part }: { part: UIMessagePart<any, any> }) {
    return match(part)
        .with({ type: 'text' }, ({ text }) => <MessageContent markdown>{text}</MessageContent>)
        .otherwise(() => null);
}
