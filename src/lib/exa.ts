import { Exa } from 'exa-js';
import { env } from '@/lib/env';

export const exa = new Exa(env.EXA_API_KEY);

export type SearchResults = {
    query: string;
    results: {
        title: string | null;
        url: string;
        description: string;
        image: string | undefined;
    }[];
};

export async function search(query: string): Promise<SearchResults> {
    try {
        const response = await exa.searchAndContents(query, {
            summary: true,
        });

        return {
            query,
            results: response.results.map(result => ({
                title: result.title,
                url: result.url,
                description: result.summary,
                image: result.image,
            })),
        };
    } catch (error) {
        return {
            query,
            results: [],
        };
    }
}

export async function readSite(url: string) {
    try {
        const response = await exa.getContents(url);
        const result = response.results[0];

        if (!result) {
            return {
                url,
                text: '',
            };
        }
        return {
            url,
            text: result.text,
        };
    } catch (error) {
        return {
            url,
            text: '',
        };
    }
}
