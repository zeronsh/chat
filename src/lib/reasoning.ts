/**
 * Per-model adjustable reasoning effort.
 *
 * Levels come from models.dev (`reasoning_options` of type `effort`) and are
 * keyed by the gateway model string (`model.model`). Only models listed here can
 * have their reasoning level changed; everything else hides the effort selector.
 *
 * The Vercel AI Gateway normalises `providerOptions[provider].reasoningEffort`
 * across every provider (verified live for openai/anthropic/google/xai/zai), so
 * the API just forwards the chosen level — no per-provider budget mapping needed.
 */
export type Effort = 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export const REASONING_EFFORTS: Record<string, readonly Effort[]> = {
    'openai/gpt-5': ['minimal', 'low', 'medium', 'high'],
    'openai/gpt-5-mini': ['minimal', 'low', 'medium', 'high'],
    'openai/gpt-5-nano': ['minimal', 'low', 'medium', 'high'],
    'openai/gpt-5.5': ['none', 'low', 'medium', 'high', 'xhigh'],
    'openai/gpt-5.5-pro': ['medium', 'high', 'xhigh'],
    'anthropic/claude-opus-4.8': ['low', 'medium', 'high', 'xhigh', 'max'],
    'anthropic/claude-sonnet-4.6': ['low', 'medium', 'high', 'max'],
    'anthropic/claude-fable-5': ['low', 'medium', 'high', 'xhigh', 'max'],
    'google/gemini-3-pro-preview': ['low', 'high'],
    'google/gemini-3.1-pro-preview': ['low', 'medium', 'high'],
    'google/gemini-3.5-flash': ['minimal', 'low', 'medium', 'high'],
    'xai/grok-4.3': ['none', 'low', 'medium', 'high'],
    'deepseek/deepseek-v4-flash': ['high', 'max'],
    'deepseek/deepseek-v4-pro': ['high', 'max'],
    'zai/glm-5.2': ['high', 'max'],
};

/** Effort levels a model supports, or `null` if its reasoning isn't adjustable. */
export function effortLevels(model: string | undefined | null): readonly Effort[] | null {
    return (model && REASONING_EFFORTS[model]) || null;
}

/** The default level for a model: prefer `medium`, else the middle of the range. */
export function defaultEffort(levels: readonly Effort[]): Effort {
    return levels.includes('medium') ? 'medium' : levels[Math.floor((levels.length - 1) / 2)];
}

/**
 * The effective effort to use: the chosen level if it's valid for this model,
 * otherwise the model's default. Returns `null` for models without adjustable
 * effort, so callers can skip sending it. Also the server-side validator —
 * never trust a raw client value.
 */
export function resolveEffort(
    model: string | undefined | null,
    chosen: string | null | undefined
): Effort | null {
    const levels = effortLevels(model);
    if (!levels) return null;
    if (chosen && (levels as readonly string[]).includes(chosen)) return chosen as Effort;
    return defaultEffort(levels);
}

/** Human label for a level, e.g. `xhigh` → "X-High". */
export function effortLabel(effort: Effort): string {
    if (effort === 'xhigh') return 'X-High';
    return effort.charAt(0).toUpperCase() + effort.slice(1);
}
