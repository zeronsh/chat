import { Button } from '@/components/ui/button';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDatabase } from '@/context/database';
import { useThreadsByTimeRange } from '@/hooks/use-chats-by-time-range';
import { Thread } from '@/zero/types';
import { useQuery } from '@rocicorp/zero/react';
import { Link } from '@tanstack/react-router';
import { HashIcon, Loader2Icon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <AppSidebarHeader />
            </SidebarHeader>
            <SidebarContent>
                <AppSidebarActions />
                <AppSidebarThreads />
            </SidebarContent>
        </Sidebar>
    );
}

function AppSidebarHeader() {
    return (
        <SidebarMenu className="flex-row items-center gap-2 pr-3 justify-between">
            <SidebarMenuItem>
                <Button variant="ghost" size="icon" asChild>
                    <SidebarMenuButton
                        asChild
                        className="data-[slot=sidebar-menu-button]:!p-1.5 flex-shrink"
                    >
                        <Link to="/">
                            <span className="sr-only">Zeron</span>
                        </Link>
                    </SidebarMenuButton>
                </Button>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function AppSidebarActions() {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/">
                                <PlusIcon />
                                <span className="flex-1">New Chat</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function AppSidebarThreads() {
    const [threadToEdit, setThreadToEdit] = useState<Thread | null>(null);
    const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);
    const db = useDatabase();
    const [threads] = useQuery(db.query.thread.orderBy('updatedAt', 'desc'));
    const groups = useThreadsByTimeRange(threads);

    return (
        <Fragment>
            <ThreadGroup
                threads={groups.today}
                label="Today"
                setThreadToEdit={setThreadToEdit}
                setThreadToDelete={setThreadToDelete}
            />
            <ThreadGroup
                threads={groups.yesterday}
                label="Yesterday"
                setThreadToEdit={setThreadToEdit}
                setThreadToDelete={setThreadToDelete}
            />
            <ThreadGroup
                threads={groups.lastThirtyDays}
                label="Last 30 Days"
                setThreadToEdit={setThreadToEdit}
                setThreadToDelete={setThreadToDelete}
            />
            <ThreadGroup
                threads={groups.history}
                label="History"
                setThreadToEdit={setThreadToEdit}
                setThreadToDelete={setThreadToDelete}
            />
        </Fragment>
    );
}

function ThreadGroup({
    threads,
    label,
    setThreadToEdit,
    setThreadToDelete,
}: {
    threads: Thread[];
    label: string;
    setThreadToEdit: (thread: Thread) => void;
    setThreadToDelete: (thread: Thread) => void;
}) {
    if (threads.length === 0) return null;
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {threads.map(thread => (
                        <ThreadItem
                            key={thread.id}
                            thread={thread}
                            setThreadToEdit={setThreadToEdit}
                            setThreadToDelete={setThreadToDelete}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function ThreadItem({
    thread,
    setThreadToEdit,
    setThreadToDelete,
}: {
    thread: Thread;
    setThreadToEdit: (thread: Thread) => void;
    setThreadToDelete: (thread: Thread) => void;
}) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <div className="group/thread-item relative">
                    <Link
                        to="/$threadId"
                        className="w-full flex absolute inset-0 items-center px-2 rounded-md gap-2"
                        params={{ threadId: thread.id }}
                        activeOptions={{ exact: true }}
                        activeProps={{ className: 'bg-muted' }}
                    >
                        <HashIcon className="size-4" />
                        <span className="truncate flex-1">{thread.title}</span>
                        {(thread.status === 'streaming' || thread.status === 'submitted') && (
                            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                        )}
                    </Link>
                    <div className="absolute top-0 right-0 bottom-0 pointer-events-none flex justify-end gap-2 px-4 items-center group-hover/thread-item:opacity-100 opacity-0 transition-all duration-100 bg-gradient-to-l from-sidebar to-transparent w-full rounded-r-md" />
                    <div className="absolute top-0 right-0 bottom-0 flex justify-end gap-2 px-2 items-center group-hover/thread-item:opacity-100 group-hover/thread-item:translate-x-0 translate-x-full opacity-0 transition-all duration-100 rounded-r-lg pointer-events-none group-hover/thread-item:pointer-events-auto">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 hover:text-primary hover:bg-transparent"
                                    onClick={() => setThreadToEdit(thread)}
                                >
                                    <PencilIcon className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Thread Title</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 hover:text-primary"
                                    onClick={() => setThreadToDelete(thread)}
                                >
                                    <TrashIcon className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Thread</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
