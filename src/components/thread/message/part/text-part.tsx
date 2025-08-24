import { MessageContent } from '@/components/ui/message';
import { usePart, useThreadSelector } from '@/context/thread';
import { lexer } from '@/lib/utils';
import { useDebounce } from '@uidotdev/usehooks';
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
        const shouldAnimate = useThreadSelector(state => {
            const nextMessageIndex = state.messages.findIndex(msg => msg.id === id) + 1;
            const nextMessage = state.messages[nextMessageIndex];

            return nextMessage === undefined && state.status === 'streaming';
        });

        const debouncedAnimated = useDebounce(shouldAnimate, 1000);

        if (content === undefined || content === '') {
            return null;
        }

        return (
            <MessageContent markdown animated={debouncedAnimated}>
                {content}
            </MessageContent>
        );
    },
    function propsAreEqual(prevProps, nextProps) {
        return (
            prevProps.id === nextProps.id &&
            prevProps.index === nextProps.index &&
            prevProps.blockIndex === nextProps.blockIndex
        );
    }
);

export const FinishedMarkdownBlock = memo(function PureFinishedMarkdownBlock({
    id,
    index,
}: {
    id: string;
    index: number;
}) {
    const content = usePart({
        id,
        index,
        type: 'text',
        selector: part => part.text,
        equalityFn: (a, b) => a === b,
    });

    return <MessageContent markdown>{content}</MessageContent>;
});

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
