import { MessageContent } from '@/components/ui/message';
import { usePart } from '@/context/thread';
import { cn } from '@/lib/utils';
import { useDebounce } from '@uidotdev/usehooks';
import { AnimatePresence, motion } from 'framer-motion';
import { BrainIcon, Loader2Icon } from 'lucide-react';
import { memo, useState, useCallback } from 'react';

export const ReasoningPart = memo(function PureReasoningPart({
    id,
    index,
}: {
    id: string;
    index: number;
}) {
    const part = usePart({ id, index, type: 'reasoning', selector: part => part });
    const [_isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
    const done = part.state === 'done';
    const debouncedDone = useDebounce(done, 1000);
    const isOpen =
        (typeof _isOpen === 'boolean' ? _isOpen : !debouncedDone) && part.text.length > 0;

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
                        className="overflow-hidden p-3 bg-sidebar rounded-lg mt-3 border border-foreground/10"
                    >
                        <MessageContent
                            markdown
                            className="bg-transparent p-0! text-sm opacity-80 w-full max-w-full! prose dark:prose-invert"
                        >
                            {part.text}
                        </MessageContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
