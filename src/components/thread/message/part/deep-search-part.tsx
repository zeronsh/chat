import { usePart, useThreadSelector } from '@/context/thread';
import {
    BinocularsIcon,
    SearchIcon,
    FileTextIcon,
    CheckCircleIcon,
    NotebookPenIcon,
} from 'lucide-react';
import { memo, useState, useEffect, useMemo } from 'react';
import {
    ChainOfThought,
    ChainOfThoughtContent,
    ChainOfThoughtHeader,
    ChainOfThoughtSearchResult,
    ChainOfThoughtSearchResults,
    ChainOfThoughtStep,
} from '@/components/ai-elements/chain-of-thought';
import { DeepSearchPart as DeepSearchPartType } from '@/ai/tools/deep-search-tool';
import { useDebounce } from '@uidotdev/usehooks';

export const DeepSearchPart = memo(({ id, index }: { id: string; index: number }) => {
    const { done, toolCallId } = usePart({
        id,
        index,
        type: 'tool-deepSearch',
        selector: part => ({
            done: part.output !== undefined,
            toolCallId: part.toolCallId,
        }),
    });

    const [_isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
    const debouncedDone = useDebounce(done, 1000);

    const dataParts = useThreadSelector(state => {
        return state.messageMap[id].parts
            .filter(part => part.type === 'data-deep-search')
            .filter(part => part.data.toolCallId === toolCallId)
            .map(part => part.data);
    });

    const isOpen =
        typeof _isOpen === 'boolean'
            ? _isOpen && dataParts.length > 0
            : !debouncedDone && dataParts.length > 0;

    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        if (!done) {
            const interval = setInterval(() => {
                setCurrentTime(Date.now());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [done]);

    const timeElapsed = useMemo(() => {
        const start = dataParts.find(part => part.type === 'start');
        const completed = dataParts.find(part => part.type === 'completed');

        if (!start) return 0;

        const startTime = start.timestamp;
        const endTime = completed ? completed.timestamp : currentTime;

        return Math.max(0, Math.round((endTime - startTime) / 1000));
    }, [dataParts, currentTime]);

    const renderStep = (part: DeepSearchPartType, stepIndex: number) => {
        const isLast = stepIndex === dataParts.length - 1;
        const status =
            part.type === 'completed' ? 'complete' : isLast && !done ? 'active' : 'complete';

        switch (part.type) {
            case 'start':
                return (
                    <ChainOfThoughtStep
                        key={`${part.type}-${stepIndex}`}
                        icon={NotebookPenIcon}
                        label="Planning"
                        description={part.thoughts}
                        status={status}
                    />
                );
            case 'search':
                return (
                    <ChainOfThoughtStep
                        key={`${part.type}-${stepIndex}`}
                        icon={SearchIcon}
                        label="Searching"
                        description={part.thoughts}
                        status={status}
                    />
                );

            case 'search-results':
                return (
                    <ChainOfThoughtStep
                        key={`${part.type}-${stepIndex}`}
                        icon={SearchIcon}
                        label={`Found ${part.results.length} search results`}
                        status={status}
                    >
                        <ChainOfThoughtSearchResults>
                            {part.results.slice(0, 5).map((result: any, resultIndex: number) => {
                                let hostname = 'example.com';
                                try {
                                    const urlObj = new URL(result.url);
                                    hostname = urlObj.hostname || 'example.com';
                                } catch {
                                    hostname = 'example.com';
                                }

                                return (
                                    <ChainOfThoughtSearchResult key={`result-${resultIndex}`}>
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                                            alt={`${hostname} favicon`}
                                            className="w-3 h-3 rounded-sm"
                                            onError={e => {
                                                e.currentTarget.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
                                            }}
                                        />
                                        {result.title || hostname}
                                    </ChainOfThoughtSearchResult>
                                );
                            })}
                        </ChainOfThoughtSearchResults>
                    </ChainOfThoughtStep>
                );

            case 'read-site':
                return (
                    <ChainOfThoughtStep
                        key={`${part.type}-${stepIndex}`}
                        icon={FileTextIcon}
                        label="Reading webpage"
                        description={part.thoughts}
                        status={status}
                    >
                        <ChainOfThoughtSearchResults>
                            {(() => {
                                let hostname = 'example.com';
                                try {
                                    const urlObj = new URL(part.url);
                                    hostname = urlObj.hostname || 'example.com';
                                } catch {
                                    hostname = 'example.com';
                                }

                                return (
                                    <ChainOfThoughtSearchResult>
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                                            alt={`${hostname} favicon`}
                                            className="w-3 h-3 rounded-sm"
                                            onError={e => {
                                                e.currentTarget.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
                                            }}
                                        />
                                        {hostname}
                                    </ChainOfThoughtSearchResult>
                                );
                            })()}
                        </ChainOfThoughtSearchResults>
                    </ChainOfThoughtStep>
                );

            case 'read-site-results':
                return (
                    <ChainOfThoughtStep
                        key={`${part.type}-${stepIndex}`}
                        icon={FileTextIcon}
                        label="Completed reading webpage"
                        description={`Read ${part.content.length} characters`}
                        status={status}
                    />
                );

            case 'completed':
                return (
                    <ChainOfThoughtStep
                        key={`${part.type}-${stepIndex}`}
                        icon={CheckCircleIcon}
                        label="Deep search completed"
                        status="complete"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <ChainOfThought open={isOpen} onOpenChange={setIsOpen}>
            <ChainOfThoughtHeader icon={BinocularsIcon}>
                {done ? `Research completed in ${timeElapsed}s` : `Researching for ${timeElapsed}s`}
            </ChainOfThoughtHeader>
            <ChainOfThoughtContent>
                {dataParts.map((part, index) => renderStep(part, index))}
            </ChainOfThoughtContent>
        </ChainOfThought>
    );
});
