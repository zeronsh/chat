import { UserMenu } from '@/components/app/user-menu';
import { ThemeSelector } from '@/components/app/theme-selector';
import { ModelSelector } from '@/components/app/model-selector';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useParams } from '@tanstack/react-router';

export function Header() {
    const params = useParams({
        from: '/_thread/$threadId',
        shouldThrow: false,
    }) ?? { threadId: undefined };
    return (
        <div
            className={cn(
                params.threadId && 'border-b',
                '2xl:border-none 2xl:bg-transparent 2xl:backdrop-blur-none',
                'bg-background/50 border-foreground/10 backdrop-blur-md absolute top-0 left-0 right-0 z-10 flex justify-between'
            )}
        >
            <div className="flex items-center gap-2 p-3">
                <SidebarTrigger />
                <ModelSelector />
            </div>
            <div className="flex items-center gap-2 p-3">
                <ThemeSelector />
                <UserMenu />
            </div>
        </div>
    );
}
