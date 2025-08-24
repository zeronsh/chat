import { MessageContent } from '@/components/ui/message';
import { usePart, useThreadSelector } from '@/context/thread';
import { cn, lexer } from '@/lib/utils';
import { useDebounce } from '@uidotdev/usehooks';
import { AnimatePresence, motion } from 'framer-motion';
import { BrainIcon, Loader2Icon } from 'lucide-react';
import { memo, useState, useCallback } from 'react';

export const ReasoningBlock = memo(
    function PureReasoningBlock({
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
            type: 'reasoning',
            selector: part => lexer(part?.text ?? '')[blockIndex],
            equalityFn: (a, b) => a === b,
        });

        const shouldAnimate = useThreadSelector(state => {
            const nextMessageIndex = state.messages.findIndex(msg => msg.id === id) + 1;
            const nextMessage = state.messages[nextMessageIndex];

            return nextMessage === undefined && state.status === 'streaming';
        });

        const debouncedAnimated = useDebounce(shouldAnimate, 1000);

        if (content === undefined || content === null) {
            return null;
        }

        return (
            <MessageContent
                className="text-sm text-muted-foreground"
                markdown
                animated={debouncedAnimated}
            >
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

export const ReasoningText = memo(
    function PureReasoningText({ id, index }: { id: string; index: number }) {
        return Array.from({ length: 100 }, (_, i) => i).map(i => (
            <ReasoningBlock key={`${id}-${index}-${i}`} id={id} index={index} blockIndex={i} />
        ));
    },
    function propsAreEqual() {
        return true;
    }
);

export const ReasoningPart = memo(function PureReasoningPart({
    id,
    index,
}: {
    id: string;
    index: number;
}) {
    const { done, hasText } = usePart({
        id,
        index,
        type: 'reasoning',
        selector: part => ({
            done: part?.state ? part?.state === 'done' : null,
            hasText: part?.text ? part?.text?.length > 0 : false,
        }),
    });

    if (done === null) {
        return null;
    }

    const [_isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
    const debouncedDone = useDebounce(done, 1000);
    const isOpen = typeof _isOpen === 'boolean' ? _isOpen && hasText : !debouncedDone && hasText;

    const toggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <div className={cn('w-full', !done && 'animate-pulse')}>
            <button
                type="button"
                onClick={toggle}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
                <BrainIcon className="size-3" />
                <span>{done ? 'Reasoned' : 'Reasoning'}</span>
                {!done && <Loader2Icon className="size-3 animate-spin" />}
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex flex-col overflow-hidden p-3 bg-sidebar rounded-lg mt-3 border border-foreground/10 gap-2"
                    >
                        <ReasoningText id={id} index={index} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
