import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';
import { marked } from 'marked';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    21
);

export function seededRandom(seed: number): () => number {
    let state = seed;
    return (): number => {
        // Constants for the LCG (these values are commonly used)
        const a = 1664525; // Multiplier
        const c = 1013904223; // Increment
        const m = 2 ** 32; // Modulus (2^32)
        state = (a * state + c) % m;
        return state / m; // Normalize to [0, 1)
    };
}

export const lexer = (() => {
    let lastText = '';
    let lastResult: string[] = [];
    return (markdown: string): string[] => {
        if (markdown === lastText) {
            return lastResult;
        }
        lastText = markdown;
        const tokens = marked.lexer(markdown);
        lastResult = tokens.map(token => token.raw);
        return lastResult;
    };
})();
