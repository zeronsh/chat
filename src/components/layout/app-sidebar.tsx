import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
import { useDatabase, useThreads } from '@/hooks/use-database';
import { useThreadsByTimeRange } from '@/hooks/use-chats-by-time-range';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { Loader2Icon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { Label } from '@/components/ui/label';
import ZeronIcon from '../icons/zeron';
import { Thread, useAppStore } from '@/stores/app';

export function AppSidebar() {
    const [threadToEdit, setThreadToEdit] = useState<Thread | null>(null);
    const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);

    return (
        <Sidebar>
            <AppSidebarHeader />
            <SidebarContent>
                <AppSidebarActions />
                <AppSidebarThreads
                    setThreadToEdit={setThreadToEdit}
                    setThreadToDelete={setThreadToDelete}
                />
            </SidebarContent>
            <EditThreadTitleDialog thread={threadToEdit} setThreadToEdit={setThreadToEdit} />
            <DeleteThreadDialog thread={threadToDelete} setThreadToDelete={setThreadToDelete} />
        </Sidebar>
    );
}

function AppSidebarHeader() {
    return (
        <SidebarHeader className="p-3">
            <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                    <ZeronIcon className="size-6" />
                </Link>
            </Button>
        </SidebarHeader>
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
                                <span className="flex-1">New Thread</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function AppSidebarThreads({
    setThreadToEdit,
    setThreadToDelete,
}: {
    setThreadToEdit: (thread: Thread | null) => void;
    setThreadToDelete: (thread: Thread | null) => void;
}) {
    const threads = useAppStore(state => state.getAllThreads());
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
            <p className="text-sm text-muted-foreground/50 p-4">
                You've reached the end of your threads.
            </p>
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

const editThreadTitleSchema = z.object({
    title: z.string().min(1).max(200),
});

function EditThreadTitleDialog({
    thread,
    setThreadToEdit,
}: {
    thread: Thread | null;
    setThreadToEdit: (thread: Thread | null) => void;
}) {
    const db = useDatabase();
    const form = useForm({
        defaultValues: {
            title: thread?.title ?? '',
        },
        validators: {
            onMount: editThreadTitleSchema,
            onChange: editThreadTitleSchema,
            onSubmit: editThreadTitleSchema,
        },
        onSubmit: async ({ value }) => {
            if (!thread) return;

            await db.mutate.thread.update({
                id: thread.id,
                title: value.title,
            });
            setThreadToEdit(null);
        },
    });

    return (
        <Dialog open={!!thread} onOpenChange={() => setThreadToEdit(null)}>
            <DialogContent className="p-0 overflow-hidden gap-0" showCloseButton={false}>
                <DialogHeader className="p-6 bg-sidebar border-b border-foreground/10">
                    <DialogTitle>Edit Thread Title</DialogTitle>
                    <DialogDescription>Edit the title of the thread.</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={async e => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <div className="grid gap-4 px-6 py-4 bg-background">
                        <div className="grid gap-2">
                            <form.Field
                                name="title"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (value.length === 0) return 'Title is required';
                                        if (value.length > 100)
                                            return 'Title must be less than 100 characters';
                                    },
                                }}
                            >
                                {field => (
                                    <>
                                        <Label>Title</Label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={field.state.value}
                                            onChange={e => field.handleChange(e.target.value)}
                                        />
                                        {field.state.meta.errors ? (
                                            <p className="text-sm text-destructive">
                                                {field.state.meta.errors.join(', ')}
                                            </p>
                                        ) : null}
                                    </>
                                )}
                            </form.Field>
                        </div>
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setThreadToEdit(null)}
                        >
                            Cancel
                        </Button>
                        <form.Subscribe
                            selector={state => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting}
                                    onClick={() => form.handleSubmit()}
                                >
                                    {isSubmitting && (
                                        <Loader2Icon className="w-4 h-4 animate-spin" />
                                    )}
                                    <span>Save</span>
                                </Button>
                            )}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteThreadDialog({
    thread,
    setThreadToDelete,
}: {
    thread: Thread | null;
    setThreadToDelete: (thread: Thread | null) => void;
}) {
    const db = useDatabase();
    const params = useParams({ from: '/_thread/$threadId', shouldThrow: false });

    const navigate = useNavigate();

    async function handleDelete() {
        if (!thread) return;
        await db.mutate.thread.delete({ id: thread.id });
        if (params?.threadId === thread.id) {
            navigate({ to: '/' });
        }
        setThreadToDelete(null);
    }

    return (
        <Dialog open={!!thread} onOpenChange={() => setThreadToDelete(null)}>
            <DialogContent className="p-0 overflow-hidden gap-0" showCloseButton={false}>
                <DialogHeader className="p-6 bg-background">
                    <DialogTitle>Delete Thread</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this thread? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
                    <Button type="button" variant="outline" onClick={() => setThreadToDelete(null)}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
