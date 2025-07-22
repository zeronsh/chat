import { Part } from '@/components/thread/message/part';
import { ThreadMessage } from '@/ai/types';

export function UIMessage({ message }: { message: ThreadMessage }) {
    return message.parts.map((part, i) => <Part key={i} part={part} />);
}
