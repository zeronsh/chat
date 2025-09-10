import { usePart, useThreadSelector } from '@/context/thread';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUpIcon, Loader2Icon, SearchIcon } from 'lucide-react';
import { memo, useState, useCallback, useEffect } from 'react';

export const DeepSearchPart = memo(({ id, index }: { id: string; index: number }) => {
    const { done, toolCallId, query } = usePart({
        id,
        index,
        type: 'tool-deepSearch',
        selector: part => ({
            done: part.output !== undefined,
            toolCallId: part.toolCallId,
            query: part.input?.query || 'Deep research',
        }),
    });

    const dataParts = useThreadSelector(state => {
        return state.messageMap[id].parts
            .filter(part => part.type === 'data-deep-search')
            .filter(part => part.data.toolCallId === toolCallId)
            .map(part => part.data);
    });

    const [isOpen, setIsOpen] = useState(false);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);

    // Update elapsed time every second
    useEffect(() => {
        if (!done) {
            const interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [done, startTime]);

    const toggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    // Get current activity
    const getCurrentActivity = () => {
        if (done) return 'Deep research complete';

        const lastStep = dataParts[dataParts.length - 1];
        if (!lastStep) return 'Starting deep research';

        switch (lastStep.type) {
            case 'start':
                return 'Planning research strategy';
            case 'plan':
                return 'Creating research plan';
            case 'plan-results':
                return 'Executing research plan';
            case 'search':
                return `Searching: ${lastStep.query}`;
            case 'search-results':
                return 'Processing search results';
            case 'read-site':
                return `Reading: ${new URL(lastStep.url).hostname}`;
            case 'read-site-results':
                return 'Analyzing content';
            default:
                return 'Deep researching';
        }
    };

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    };

    const renderStepContent = (step: any, stepIndex: number) => {
        switch (step.type) {
            case 'start':
                return (
                    <div className="text-sm">
                        <div className="font-medium mb-1">Starting Research</div>
                        <div className="text-muted-foreground">{step.thoughts}</div>
                    </div>
                );
            case 'plan-results':
                return (
                    <div className="text-sm">
                        <div className="font-medium mb-2">Research Plan</div>
                        <ul className="space-y-1 text-muted-foreground">
                            {step.plan.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">
                                        {idx + 1}
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'search':
                return (
                    <div className="text-sm">
                        <div className="font-medium mb-1 flex items-center gap-2">
                            <SearchIcon className="size-3" />
                            Searching Web
                        </div>
                        <div className="text-muted-foreground mb-1">{step.thoughts}</div>
                        <div className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">
                            {step.query}
                        </div>
                    </div>
                );
            case 'search-results':
                return (
                    <div className="text-sm">
                        <div className="font-medium mb-1">Search Results</div>
                        <div className="text-muted-foreground text-xs">
                            Found {step.results.length} results for "{step.query}"
                        </div>
                        <div className="mt-2 space-y-1">
                            {step.results.slice(0, 3).map((result: any, idx: number) => (
                                <div key={idx} className="bg-muted/30 px-2 py-1 rounded text-xs">
                                    <div className="font-medium truncate">{result.title}</div>
                                    <div className="text-muted-foreground truncate">
                                        {result.url}
                                    </div>
                                </div>
                            ))}
                            {step.results.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                    +{step.results.length - 3} more results
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'read-site':
                return (
                    <div className="text-sm">
                        <div className="font-medium mb-1">Reading Website</div>
                        <div className="text-muted-foreground mb-1">{step.thoughts}</div>
                        <div className="bg-muted/50 px-2 py-1 rounded text-xs font-mono truncate">
                            {step.url}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn('w-full', !done && 'animate-pulse')}>
            <button
                type="button"
                onClick={toggle}
                className="w-full bg-sidebar/50 hover:bg-sidebar border border-foreground/10 rounded-lg p-3 transition-colors"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <SearchIcon className="size-4" />
                            <span className="font-medium">{query}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {!done && <Loader2Icon className="size-3 animate-spin" />}
                            <span>{getCurrentActivity()}</span>
                            {!done && elapsedTime > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{formatTime(elapsedTime)} passed</span>
                                </>
                            )}
                        </div>
                    </div>
                    <ChevronUpIcon
                        className={cn('size-4 transition-transform', !isOpen && 'rotate-180')}
                    />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="bg-sidebar/30 border border-foreground/10 rounded-lg mt-2 p-4">
                            <div className="space-y-4">
                                {dataParts.map((step, stepIndex) => {
                                    const content = renderStepContent(step, stepIndex);
                                    if (!content) return null;

                                    return (
                                        <div
                                            key={stepIndex}
                                            className="border-l-2 border-muted pl-4"
                                        >
                                            {content}
                                        </div>
                                    );
                                })}

                                {dataParts.length === 0 && (
                                    <div className="text-sm text-muted-foreground text-center py-4">
                                        Initializing deep research...
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
