export type Limits = {
    SEARCH: number;
    RESEARCH: number;
    CREDITS: number;
};

export const AnonymousLimits: Limits = {
    SEARCH: 5,
    RESEARCH: 0,
    CREDITS: 10,
};

export const FreeLimits: Limits = {
    SEARCH: 5,
    RESEARCH: 0,
    CREDITS: 20,
};

export const ProLimits: Limits = {
    SEARCH: 50,
    RESEARCH: 5,
    CREDITS: 100,
};
