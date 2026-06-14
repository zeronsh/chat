import { Exa } from 'exa-js';
import { env } from '@/lib/env';

export const exa = new Exa(env.EXA_API_KEY);

export type SearchResult = {
    title: string | null;
    url: string;
    description: string;
    image: string | undefined;
    publishedDate: string | undefined;
};

export type SearchResults = {
    query: string;
    results: SearchResult[];
};

export async function search(query: string, numResults = 6): Promise<SearchResults> {
    try {
        const response = await exa.searchAndContents(query, {
            numResults,
            summary: true,
        });

        return {
            query,
            results: response.results.map(result => ({
                title: result.title,
                url: result.url,
                description: result.summary ?? '',
                image: result.image,
                publishedDate: result.publishedDate,
            })),
        };
    } catch {
        return {
            query,
            results: [],
        };
    }
}

export type ReadSiteResult = {
    url: string;
    title: string | null;
    /** Page contents, trimmed to keep the model's context lean. */
    text: string;
    summary: string;
};

/** Roughly bound the returned page text so a single read can't flood context. */
const MAX_READ_CHARS = 12_000;

export async function readSite(url: string): Promise<ReadSiteResult> {
    try {
        const response = await exa.getContents(url, {
            text: true,
            summary: true,
        });
        const result = response.results[0];

        if (!result) {
            return { url, title: null, text: '', summary: '' };
        }

        const text = result.text ?? '';
        return {
            url,
            title: result.title,
            text: text.length > MAX_READ_CHARS ? `${text.slice(0, MAX_READ_CHARS)}…` : text,
            summary: result.summary ?? '',
        };
    } catch {
        return { url, title: null, text: '', summary: '' };
    }
}
