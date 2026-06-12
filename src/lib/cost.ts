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

export type PriceTier = '$' | '$$' | '$$$';

/** Rough price tier for display, based on output token price. */
export function getModelPriceTier(pricing: { outputCost?: number | null }): PriceTier {
    const outputCost = pricing.outputCost ?? 0;
    if (outputCost < 1_000_000) return '$'; // under $1/M output tokens
    if (outputCost < 20_000_000) return '$$'; // under $20/M output tokens
    return '$$$';
}
