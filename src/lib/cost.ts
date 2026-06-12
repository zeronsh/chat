import type { LanguageModelUsage } from 'ai';

export type ModelPricing = {
    /** micro-dollars per million input tokens */
    inputCost: number;
    /** micro-dollars per million output tokens */
    outputCost: number;
};

/**
 * Cost of a generation in micro-dollars, from actual token usage.
 * Reasoning tokens are billed at the output rate. `totalTokens` includes
 * reasoning overhead while `outputTokens` may not, so prefer
 * `totalTokens - inputTokens` for the output side.
 */
export function calculateTokenCost(pricing: ModelPricing, usage: LanguageModelUsage): number {
    const inputTokens = usage.inputTokens ?? 0;
    const outputTokens =
        usage.totalTokens != null
            ? Math.max(usage.totalTokens - inputTokens, usage.outputTokens ?? 0)
            : (usage.outputTokens ?? 0) + (usage.reasoningTokens ?? 0);
    return Math.ceil(
        (inputTokens * pricing.inputCost + outputTokens * pricing.outputCost) / 1_000_000
    );
}

/** Format a micro-dollars-per-million-tokens price as dollars, e.g. 3000000 -> "$3". */
export function formatTokenPrice(microDollarsPerMillion: number | null | undefined): string {
    const dollars = (microDollarsPerMillion ?? 0) / 1_000_000;
    return dollars.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}
