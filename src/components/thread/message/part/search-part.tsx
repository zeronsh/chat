import { usePart, useThreadSelector } from '@/context/thread';
import { SearchIcon } from 'lucide-react';
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
        <div className="w-full">
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
                <SearchIcon className="size-4" />
                <span>{done ? 'Searched' : 'Searching'}</span>
            </button>
        </div>
    );
});
