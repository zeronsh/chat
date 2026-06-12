export type Limits = {
    /** daily inference budget in micro-dollars */
    BUDGET: number;
    RESEARCH: number;
};

export const MICRO_DOLLARS = 1_000_000;

/** flat cost charged per Exa search query, in micro-dollars */
export const SEARCH_COST = 5_000;

/** flat cost charged per research/deep-search task (covers Exa calls and internal model usage), in micro-dollars */
export const RESEARCH_COST = 100_000;

export const AnonymousLimits: Limits = {
    BUDGET: 0.25 * MICRO_DOLLARS,
    RESEARCH: 0,
};

export const FreeLimits: Limits = {
    BUDGET: 1 * MICRO_DOLLARS,
    RESEARCH: 0,
};

export const ProLimits: Limits = {
    BUDGET: 10 * MICRO_DOLLARS,
    RESEARCH: 15,
};
