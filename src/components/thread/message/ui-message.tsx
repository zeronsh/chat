import { Part } from '@/components/thread/message/part';
import { memo } from 'react';
import { usePartSelector } from '@/context/thread';

export const UIMessage = memo(function PureUIMessage({ id }: { id: string }) {
    const partsLength = usePartSelector(parts => parts.length);
    return Array.from({ length: partsLength }).map((_, i) => <Part key={i} id={id} index={i} />);
});
