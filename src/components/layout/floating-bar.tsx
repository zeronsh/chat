import { Link } from '@tanstack/react-router';
import { MoreHorizontalIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditThreadTitleDialog, DeleteThreadDialog } from '@/components/layout/app-sidebar';
import { useThreadFromParams } from '@/hooks/use-database';
import type { Thread } from '@/zero/types';

/**
 * Floating sidebar-toggle + new-chat controls, top-left over the content.
 * Fades out while the sidebar is showing (its controls live there), fades in
 * once the sidebar is collapsed/closed. The fade-in is delayed ~200ms (the
 * sidebar's own close duration) so the two animations don't run at once; the
 * fade-out stays immediate (`delay-0` scoped to the hidden state).
 *
 * When a chat is open it also offers a ⋯ menu to rename/delete it — the
 * sidebar-collapsed equivalent of the per-row hover actions.
 */
export function FloatingBar() {
    const { open, openMobile, isMobile } = useSidebar();
    const sidebarVisible = isMobile ? openMobile : open;
    const thread = useThreadFromParams();
    const [threadToEdit, setThreadToEdit] = useState<Thread | null>(null);
    const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);

    return (
        <>
            <div
                data-hidden={sidebarVisible}
                className="fixed top-3 left-3 z-30 flex items-center gap-1 rounded-xl border border-foreground/8 bg-sidebar/60 p-1 shadow-sm backdrop-blur-md transition-all duration-200 delay-200 data-[hidden=true]:delay-0 data-[hidden=true]:pointer-events-none data-[hidden=true]:-translate-x-1 data-[hidden=true]:opacity-0"
            >
                <SidebarTrigger className="size-8 rounded-lg" />
                <Button variant="ghost" size="icon" className="size-8 rounded-lg" asChild>
                    <Link to="/" aria-label="New chat">
                        <PlusIcon className="size-4" />
                    </Link>
                </Button>
                {thread ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-lg"
                                aria-label="Chat options"
                            >
                                <MoreHorizontalIcon className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" sideOffset={8} className="w-44">
                            <DropdownMenuItem onClick={() => setThreadToEdit(thread)}>
                                <PencilIcon className="size-4" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setThreadToDelete(thread)}
                            >
                                <TrashIcon className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}
            </div>
            {/* Keyed by thread id so the rename form re-initialises with the
                current title when the open chat changes. */}
            <EditThreadTitleDialog
                key={threadToEdit?.id ?? 'none'}
                thread={threadToEdit}
                setThreadToEdit={setThreadToEdit}
            />
            <DeleteThreadDialog thread={threadToDelete} setThreadToDelete={setThreadToDelete} />
        </>
    );
}
