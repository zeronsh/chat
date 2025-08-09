import { MessageContent } from '@/components/ui/message';
import { usePart } from '@/context/thread';
import { lexer } from '@/lib/utils';
import { memo } from 'react';

export const MarkdownBlock = memo(
    function PureMarkdownBlock({
        id,
        index,
        blockIndex,
    }: {
        id: string;
        index: number;
        blockIndex: number;
    }) {
        const content = usePart({
            id,
            index,
            type: 'text',
            selector: part => lexer(part.text)[blockIndex],
            equalityFn: (a, b) => a === b,
        });

        if (content === undefined) {
            return null;
        }

        return <MessageContent markdown>{content}</MessageContent>;
    },
    function propsAreEqual(prevProps, nextProps) {
        return (
            prevProps.id === nextProps.id &&
            prevProps.index === nextProps.index &&
            prevProps.blockIndex === nextProps.blockIndex
        );
    }
);

export const TextPart = memo(
    function PureTextPart({ id, index }: { id: string; index: number }) {
        return Array.from({ length: 100 }, (_, i) => i).map(i => (
            <MarkdownBlock key={`${id}-${index}-${i}`} id={id} index={index} blockIndex={i} />
        ));
    },
    function propsAreEqual() {
        return true;
    }
);
