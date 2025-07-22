import { Section } from '@/components/ui/section';

import { Separator } from '@/components/ui/separator';
import { useDatabase } from '@/context/database';
import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { MoonIcon, SunIcon } from 'lucide-react';

const themes = [
    {
        name: 'Default',
        value: 'default',
        description: 'Clean and minimal design',
    },
    {
        name: 'T3 Chat',
        value: 't3-chat',
        description: 'Modern chat interface style',
    },
    {
        name: 'Claymorphism',
        value: 'claymorphism',
        description: 'Soft, clay-like appearance',
    },
    {
        name: 'Claude',
        value: 'claude',
        description: "Anthropic's Claude-inspired theme",
    },
    {
        name: 'Graphite',
        value: 'graphite',
        description: 'Dark and sophisticated',
    },
    {
        name: 'Amethyst Haze',
        value: 'amethyst-haze',
        description: 'Purple-tinted aesthetic',
    },
    {
        name: 'Vercel',
        value: 'vercel',
        description: 'Vercel-inspired design',
    },
];

export const Route = createFileRoute('/_account/account/appearance')({
    component: RouteComponent,
});

function RouteComponent() {
    const settings = useSettings();
    const db = useDatabase();

    if (!settings) return null;

    const mode = settings.mode ?? 'dark';

    const handleThemeChange = (themeValue: string) => {
        db.mutate.setting.update({
            id: settings.id,
            theme: themeValue,
        });
    };

    const handleModeChange = (newMode: 'light' | 'dark') => {
        db.mutate.setting.update({
            id: settings.id,
            mode: newMode,
        });
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <title>Appearance | Zeron</title>
            <Section title="Mode" description="Choose between light and dark mode">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        type="button"
                        className={cn(
                            'relative p-4 rounded-lg border cursor-pointer transition-all hover:border-foreground/20 text-left w-full bg-muted/50 backdrop-blur-md border-foreground/15',
                            settings.mode === 'light'
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-foreground/10 hover:bg-muted/50'
                        )}
                        onClick={() => handleModeChange('light')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                                <SunIcon className="size-4" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Light Mode</div>
                                <div className="text-sm text-muted-foreground">
                                    Bright interface for daytime use
                                </div>
                            </div>
                        </div>
                        {settings.mode === 'light' && (
                            <div className="absolute top-2 right-2">
                                <div className="size-2 bg-primary rounded-full" />
                            </div>
                        )}
                    </button>

                    <button
                        type="button"
                        className={cn(
                            'relative p-4 rounded-lg border cursor-pointer transition-all hover:border-foreground/20 text-left w-full bg-muted/50 backdrop-blur-md border-foreground/15',
                            settings.mode === 'dark'
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-foreground/10 hover:bg-muted/50'
                        )}
                        onClick={() => handleModeChange('dark')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                                <MoonIcon className="size-4" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Dark Mode</div>
                                <div className="text-sm text-muted-foreground">
                                    Dark interface for nighttime use
                                </div>
                            </div>
                        </div>
                        {settings.mode === 'dark' && (
                            <div className="absolute top-2 right-2">
                                <div className="size-2 bg-primary rounded-full" />
                            </div>
                        )}
                    </button>
                </div>
            </Section>
            <Separator />
            <Section title="Theme" description="Choose your preferred visual theme">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map(themeOption => (
                        <button
                            key={themeOption.value}
                            type="button"
                            className={cn(
                                'relative p-4 rounded-lg border cursor-pointer transition-all hover:border-foreground/20 text-left w-full bg-background/10 backdrop-blur-md overflow-hidden',
                                themeOption.value === settings.theme
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-foreground/10 hover:bg-muted/50'
                            )}
                            onClick={() => handleThemeChange(themeOption.value)}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{themeOption.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {themeOption.description}
                                    </div>
                                </div>
                            </div>
                            {themeOption.value === settings.theme && (
                                <div className="absolute top-2 right-2">
                                    <div className="size-2 bg-primary rounded-full" />
                                </div>
                            )}
                            <div className="flex absolute left-0 right-0 bottom-0">
                                <div
                                    className={cn(
                                        themeOption.value,
                                        mode,
                                        'size-4 bg-primary flex-1'
                                    )}
                                />
                                <div
                                    className={cn(
                                        themeOption.value,
                                        mode,
                                        'size-4 bg-secondary flex-1'
                                    )}
                                />
                                <div
                                    className={cn(
                                        themeOption.value,
                                        mode,
                                        'size-4 bg-accent flex-1'
                                    )}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </Section>
        </div>
    );
}
