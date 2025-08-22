import { Part } from '@/components/thread/message/part';
import { memo } from 'react';
import { useAppStore } from '@/stores/app';
import { useThreadIdOrThrow } from '@/hooks/use-params-thread-id';

export const UIMessage = memo(function PureUIMessage({ id }: { id: string }) {
    const threadId = useThreadIdOrThrow();
    const partsLength = useAppStore(state => state.getMessagePartsLengthById(threadId, id));
    return Array.from({ length: partsLength }).map((_, i) => <Part key={i} id={id} index={i} />);
});
