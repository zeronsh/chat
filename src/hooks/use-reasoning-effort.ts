import { useSettings } from '@/hooks/use-database';
import { useThreadSelector } from '@/context/thread';
import { effortLevels, resolveEffort, type Effort } from '@/lib/reasoning';

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
