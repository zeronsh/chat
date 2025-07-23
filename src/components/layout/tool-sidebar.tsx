import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarProvider,
    useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useThreadSelector } from '@/context/thread';
import { motion } from 'framer-motion';
import { Brain, CheckIcon, SearchIcon, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { StickToBottom } from 'use-stick-to-bottom';

export function ToolSidebar() {
    return (
        <SidebarProvider
            className="w-fit"
            defaultOpen={false}
            style={
                {
                    '--sidebar-width': '300px',
                } as React.CSSProperties
            }
        >
            <ToolSidebarBody />
        </SidebarProvider>
    );
}

function ToolSidebarBody() {
    const sidebar = useSidebar();
    const toolSidebar = useThreadSelector(state => state.toolSidebar);

    useEffect(() => {
        if (!sidebar.isMobile) {
            sidebar.setOpen(!!toolSidebar);
        } else {
            sidebar.setOpenMobile(!!toolSidebar);
        }
    }, [toolSidebar, sidebar.setOpen, sidebar.setOpenMobile, sidebar.isMobile]);

    return (
        <Sidebar side="right">
            <ToolSidebarHeader />
            <ToolSidebarContent />
        </Sidebar>
    );
}

function ToolSidebarHeader() {
    const tool = useThreadSelector(state => state.toolSidebar?.tool);
    const setToolSidebar = useThreadSelector(state => state.setToolSidebar);
    const title = useMemo(() => {
        switch (tool) {
            case 'search':
                return 'Search Results';
            case 'research':
                return 'Research Results';
            default:
                return null;
        }
    }, [tool]);

    return (
        <SidebarHeader className="absolute top-0 left-0 right-0 flex flex-row p-3 justify-between items-center border-b border-foreground/10 bg-sidebar/50 backdrop-blur-md z-10">
            <h3 className="text-lg font-semibold flex gap-2 items-center">{title}</h3>
            <Button variant="ghost" size="icon" onClick={() => setToolSidebar(undefined)}>
                <X className="size-4" />
            </Button>
        </SidebarHeader>
    );
}

function ToolSidebarContent() {
    const tool = useThreadSelector(state => state.toolSidebar?.tool);

    switch (tool) {
        case 'search':
            return (
                <SidebarContent className="px-2 pt-16 pb-2">
                    <SearchToolSidebarContent />
                </SidebarContent>
            );
        case 'research':
            return (
                <StickToBottom initial="instant" className="absolute inset-0">
                    <StickToBottom.Content className="px-2 pt-16 pb-2">
                        <ResearchToolSidebarContent />
                    </StickToBottom.Content>
                </StickToBottom>
            );
        default:
            return null;
    }
}

function SearchToolSidebarContent() {
    const toolSidebar = useThreadSelector(state => state.toolSidebar!);
    const toolCall = useThreadSelector(state =>
        state.messageMap[toolSidebar.messageId].parts.find(
            part => part.type === 'tool-search' && part.toolCallId === toolSidebar.toolCallId
        )
    );

    if (!toolCall || toolCall.type !== 'tool-search') {
        return null;
    }

    if (!toolCall.output) {
        return Array.from({ length: 10 }).map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 * (i + 1) }}
                className="flex flex-col gap-2 p-3 rounded-lg"
            >
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <div className="flex items-center gap-2 mt-3">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </motion.div>
        ));
    }

    const results = toolCall.output.results;

    return results.map((result, i) => {
        let hostname = 'example.com';
        try {
            const url = new URL(result.url);
            hostname = url.hostname || 'example.com';
        } catch {
            hostname = 'example.com';
        }
        return (
            <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 * (i + 1) }}
                key={result.url}
                className="flex flex-col gap-2 p-3 rounded-lg hover:bg-muted"
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="text-xs font-medium">{result.title}</div>
                <div className="text-xs text-muted-foreground">
                    {result.description.slice(0, 100)}...
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                    <img
                        src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                        alt={result.title ?? 'favicon'}
                        className="w-4 h-4 rounded-sm"
                        onError={e => {
                            // Fallback to a generic icon if favicon fails to load
                            e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='16'/%3E%3Cline x1='8' y1='12' x2='16' y2='12'%3E%3C/svg%3E";
                        }}
                    />
                    <span className="truncate">{result.url}</span>
                </div>
            </motion.a>
        );
    });
}

function ResearchToolSidebarContent() {
    const toolSidebar = useThreadSelector(state => state.toolSidebar!);

    const researchParts = useThreadSelector(state =>
        state.messageMap[toolSidebar.messageId].parts
            .filter(
                part =>
                    part.type === 'data-research-start' ||
                    part.type === 'data-research-search' ||
                    part.type === 'data-research-read' ||
                    part.type === 'data-research-complete'
            )
            .filter(part => part.data.toolCallId === toolSidebar.toolCallId)
    );

    return researchParts.map(part => {
        switch (part.type) {
            case 'data-research-start':
                return (
                    <div className="flex flex-col gap-4 rounded-lg p-2">
                        <div className="text-xs text-muted-foreground">{part.data.thoughts}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Brain className="size-3 text-primary" />
                            <span>Created research plan</span>
                        </div>
                    </div>
                );
            case 'data-research-search':
                return (
                    <div className="flex flex-col gap-4 rounded-lg p-2">
                        <div className="text-xs text-muted-foreground">{part.data.thoughts}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <SearchIcon className="size-3 flex-shrink-0 text-primary" />
                            <span className="truncate">Searched for {part.data.query}</span>
                        </div>
                    </div>
                );
            case 'data-research-read':
                let hostname = 'example.com';
                try {
                    const url = new URL(part.data.url);
                    hostname = url.hostname || 'example.com';
                } catch {
                    hostname = 'example.com';
                }

                return (
                    <div className="flex flex-col gap-4 rounded-lg p-2">
                        <div className="text-xs text-muted-foreground">{part.data.thoughts}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                                alt={hostname}
                                className="w-3 h-3 rounded-sm"
                                onError={e => {
                                    e.currentTarget.src =
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 12h6'/%3E%3Cpath d='M12 9v6'/%3E%3C/svg%3E";
                                }}
                            />
                            <span className="truncate">
                                Read{' '}
                                <a
                                    href={part.data.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-primary"
                                >
                                    {part.data.url}
                                </a>
                            </span>
                        </div>
                    </div>
                );
            case 'data-research-complete':
                return (
                    <div className="flex flex-col gap-4 rounded-lg p-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckIcon className="size-3 text-primary" />
                            <span>Completed research</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    });
}
