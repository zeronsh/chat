import { UserMenu } from '@/components/app/user-menu';
import { ThemeSelector } from '@/components/app/theme-selector';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';

export function Header() {
    const threadId = useParamsThreadId();

    return (
        <div
            className={cn(
                threadId && 'border-b border-foreground/10 bg-background/60 backdrop-blur-md',
                'absolute top-0 left-0 right-0 z-10 flex justify-between'
            )}
        >
            <div className="flex items-center gap-3 p-3">
                <SidebarTrigger />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground select-none">
                    Zeron
                </span>
            </div>
            <div className="flex items-center gap-2 p-3">
                <ThemeSelector />
                <UserMenu />
            </div>
        </div>
    );
}
