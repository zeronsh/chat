import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

/**
 * Floating sidebar-toggle + new-chat controls, top-left over the content.
 * Fades out while the sidebar is showing (its controls live there), fades in
 * once the sidebar is collapsed/closed. The fade-in is delayed ~200ms (the
 * sidebar's own close duration) so the two animations don't run at once; the
 * fade-out stays immediate (`delay-0` scoped to the hidden state).
 */
export function FloatingBar() {
    const { open, openMobile, isMobile } = useSidebar();
    const sidebarVisible = isMobile ? openMobile : open;

    return (
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
        </div>
    );
}
