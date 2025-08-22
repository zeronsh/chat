import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipPositioner,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDatabase } from '@/hooks/use-database';
import { useSettings } from '@/hooks/use-database';
import { cn } from '@/lib/utils';
import { MoonIcon, PaintBucket, SunIcon } from 'lucide-react';
import { useState } from 'react';

const themes = [
    {
        name: 'Default',
        value: 'default',
    },
    {
        name: 'T3 Chat',
        value: 't3-chat',
    },
    {
        name: 'Claymorphism',
        value: 'claymorphism',
    },
    {
        name: 'Claude',
        value: 'claude',
    },
    {
        name: 'Graphite',
        value: 'graphite',
    },
    {
        name: 'Amethyst Haze',
        value: 'amethyst-haze',
    },
    {
        name: 'Vercel',
        value: 'vercel',
    },
];

export function ThemeSelector() {
    const [open, setOpen] = useState(false);
    const settings = useSettings();
    const db = useDatabase();

    if (!settings) return null;

    const mode = settings.mode ?? 'dark';

    return (
        <Tooltip>
            <Popover open={open} onOpenChange={setOpen}>
                <TooltipTrigger>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" aria-expanded={open}>
                            <PaintBucket className="size-4" />
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <PopoverContent
                    className="p-0 bg-background/50 border-foreground/10 backdrop-blur-md overflow-hidden w-[250px]"
                    align="end"
                >
                    <Command>
                        <CommandInput placeholder="Search theme..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No theme found.</CommandEmpty>
                            <CommandGroup heading="Mode">
                                <CommandItem
                                    value="light"
                                    className="data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground"
                                    onSelect={() => {
                                        db.mutate.setting.update({
                                            id: settings.id,
                                            mode: 'light',
                                        });
                                    }}
                                >
                                    <SunIcon className="size-4" />
                                    <span>Light</span>
                                    <div className="flex-1" />
                                    {settings.mode === 'light' && (
                                        <span className="text-xs text-muted-foreground">
                                            Selected
                                        </span>
                                    )}
                                </CommandItem>
                                <CommandItem
                                    value="dark"
                                    className="data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground"
                                    onSelect={() => {
                                        db.mutate.setting.update({
                                            id: settings.id,
                                            mode: 'dark',
                                        });
                                    }}
                                >
                                    <MoonIcon className="size-4" />
                                    <span>Dark</span>
                                    <div className="flex-1" />
                                    {settings.mode === 'dark' && (
                                        <span className="text-xs text-muted-foreground">
                                            Selected
                                        </span>
                                    )}
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Theme">
                                {themes.map(themeOption => (
                                    <CommandItem
                                        key={themeOption.value}
                                        value={themeOption.name}
                                        className="data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground"
                                        onSelect={() => {
                                            db.mutate.setting.update({
                                                id: settings.id,
                                                theme: themeOption.value,
                                            });
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <div
                                                    className={cn(
                                                        themeOption.value,
                                                        mode,
                                                        'size-3 rounded-[3px] bg-primary'
                                                    )}
                                                />
                                                <div
                                                    className={cn(
                                                        themeOption.value,
                                                        mode,
                                                        'size-3 rounded-[3px] bg-secondary'
                                                    )}
                                                />
                                                <div
                                                    className={cn(
                                                        themeOption.value,
                                                        mode,
                                                        'size-3 rounded-[3px] bg-accent'
                                                    )}
                                                />
                                            </div>
                                            <span>{themeOption.name}</span>
                                        </div>
                                        <div className="flex-1" />
                                        {themeOption.value === settings.theme && (
                                            <span className="text-xs text-muted-foreground">
                                                Selected
                                            </span>
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <TooltipPositioner>
                <TooltipContent>
                    <p>Theme switcher</p>
                </TooltipContent>
            </TooltipPositioner>
        </Tooltip>
    );
}
