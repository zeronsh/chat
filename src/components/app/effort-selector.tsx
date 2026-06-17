import { GaugeIcon, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettings } from '@/hooks/use-database';
import { useThreadSelector } from '@/context/thread';
import { effortLabel, effortLevels, resolveEffort, type Effort } from '@/lib/reasoning';

/**
 * The effective reasoning effort for the selected model: its allowed levels, the
 * resolved current value (chosen-if-valid, else the model's default), and the
 * setter. `levels`/`value` are null for models whose reasoning isn't adjustable.
 * Shared by the selector UI and the input (which sends `value` with the request).
 */
export function useReasoningEffort(): {
    levels: readonly Effort[] | null;
    value: Effort | null;
    setEffort: (effort: string | null) => void;
} {
    const settings = useSettings();
    const model = settings?.model?.model as string | undefined;
    const levels = effortLevels(model);
    const stored = useThreadSelector(state => state.effort);
    const setEffort = useThreadSelector(state => state.setEffort);
    return { levels, value: levels ? resolveEffort(model, stored) : null, setEffort };
}

/** Reasoning-effort dropdown, shown beside the model selector for capable models. */
export function EffortSelector() {
    const { levels, value, setEffort } = useReasoningEffort();
    if (!levels || !value) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 gap-1.5 rounded-xl border border-foreground/8 bg-sidebar/40 px-2.5 font-normal hover:bg-sidebar/70"
                    aria-label="Reasoning effort"
                >
                    <GaugeIcon className="size-3.5 opacity-70" />
                    <span className="text-xs">{effortLabel(value)}</span>
                    <ChevronsUpDown className="size-3.5 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" sideOffset={8} className="min-w-[9rem]">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Reasoning effort
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={value} onValueChange={setEffort}>
                    {levels.map(level => (
                        <DropdownMenuRadioItem key={level} value={level} className="text-xs">
                            {effortLabel(level)}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
