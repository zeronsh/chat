import { useThreadSelector } from '@/context/thread';
import { ReasoningPart } from '@/components/thread/message/part/reasoning-part';
import { ErrorPart } from '@/components/thread/message/part/error-part';
import { TextPart } from '@/components/thread/message/part/text-part';
import { SearchPart } from '@/components/thread/message/part/search-part';
import { ResearchPart } from '@/components/thread/message/part/research-part';
import { DeepSearchPart } from '@/components/thread/message/part/deep-search-part';

export function Part({ id, index }: { id: string; index: number }) {
    const type = useThreadSelector(state => {
        const parts = state.messageMap[id].parts;
        if (parts[1]?.type === 'text' && parts[2]?.type === 'reasoning') {
            const textPart = parts[1];
            const reasoningPart = parts[2];
            parts[1] = reasoningPart;
            parts[2] = textPart;
        }
        return parts[index].type;
    });

    switch (type) {
        case 'reasoning':
            return <ReasoningPart id={id} index={index} />;
        case 'text':
            return <TextPart id={id} index={index} />;
        case 'tool-search':
            return <SearchPart id={id} index={index} />;
        case 'tool-research':
            return <ResearchPart id={id} index={index} />;
        case 'tool-deepSearch':
            return <DeepSearchPart id={id} index={index} />;
        case 'data-error':
            return <ErrorPart id={id} index={index} />;
        default:
            return null;
    }
}
