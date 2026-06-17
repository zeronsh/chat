import { useState } from 'react';
import { GaugeIcon, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useReasoningEffort } from '@/hooks/use-reasoning-effort';
import { effortLabel } from '@/lib/reasoning';

/** Reasoning-effort picker, shown beside the model selector for capable models.
 *  Mirrors the model selector's trigger + popover/command styling. */
export function EffortSelector() {
    const [open, setOpen] = useState(false);
    const { levels, value, setEffort } = useReasoningEffort();
    if (!levels || !value) return null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    aria-expanded={open}
                    aria-label="Reasoning effort"
                    className="h-9 rounded-xl px-3 border border-foreground/8 bg-sidebar/40 hover:bg-sidebar/70 font-normal"
                >
                    <div className="flex items-center gap-2">
                        <GaugeIcon className="size-3.5 shrink-0 text-primary" />
                        <span className="text-xs">{effortLabel(value)}</span>
                    </div>
                    <ChevronsUpDown className="opacity-50 size-3.5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-44" align="start" side="top" sideOffset={8}>
                <Command>
                    <CommandList>
                        <CommandGroup heading="Reasoning effort">
                            {levels.map(level => (
                                <CommandItem
                                    key={level}
                                    value={level}
                                    onSelect={() => {
                                        setEffort(level);
                                        setOpen(false);
                                    }}
                                >
                                    <span className="flex-1 text-sm">{effortLabel(level)}</span>
                                    {level === value && <Check className="size-4 text-primary" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
