import { usePart, useThreadSelector } from '@/context/thread';
import { cn } from '@/lib/utils';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { memo } from 'react';

export const SearchPart = memo(function PureSearchPart({
    id,
    index,
}: {
    id: string;
    index: number;
}) {
    const toolSidebar = useThreadSelector(state => state.toolSidebar);
    const setToolSidebar = useThreadSelector(state => state.setToolSidebar);
    const part = usePart({ id, index, type: 'tool-search', selector: part => part });
    const done = part.output !== undefined;

    return (
        <div className={cn('w-full', !done && 'animate-pulse')}>
            <button
                type="button"
                onClick={() => {
                    if (toolSidebar?.toolCallId === part.toolCallId) {
                        setToolSidebar(undefined);
                    } else {
                        setToolSidebar({
                            messageId: id,
                            tool: 'search',
                            toolCallId: part.toolCallId,
                        });
                    }
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
                <SearchIcon className="size-3" />
                <span>{done ? 'Searched' : 'Searching'}</span>
                {!done && <Loader2Icon className="size-3 animate-spin" />}
            </button>
        </div>
    );
});
