import { useThreadSelector } from '@/context/thread';
import { ReasoningPart } from '@/components/thread/message/part/reasoning-part';
import { ErrorPart } from '@/components/thread/message/part/error-part';
import { TextPart } from '@/components/thread/message/part/text-part';

export function Part({ id, index }: { id: string; index: number }) {
    const type = useThreadSelector(state => state.messageMap[id].parts[index].type);

    switch (type) {
        case 'reasoning':
            return <ReasoningPart id={id} index={index} />;
        case 'text':
            return <TextPart id={id} index={index} />;
        case 'data-error':
            return <ErrorPart id={id} index={index} />;
        default:
            return null;
    }
}
