import type { ThreadMessage } from '@/ai/types';
import type { ChatStatus } from 'ai';

export type Source = { url: string; title?: string };

/** A source actually cited in the response — numbered with the model's own
 *  citation number so the footer matches the inline `[n]` pills. */
export type CitedSource = { num: number; url: string; title?: string };

export type TurnBlock =
    | { kind: 'markdown'; text: string }
    | { kind: 'reasoning'; text: string; done: boolean; seconds: number | null }
    | { kind: 'error'; text: string }
    | { kind: 'tool-search'; status: 'running' | 'done'; query?: string; sources: Source[] }
    | { kind: 'tool-read'; status: 'running' | 'done'; url?: string; title?: string };

export type TurnFile = {
    url: string;
    filename?: string;
    mediaType: string;
};

export interface Turn {
    id: string;
    /** The underlying message id (differs from `id` for the synthetic pending turn). */
    messageId: string;
    role: 'user' | 'assistant';
    blocks: TurnBlock[];
    files: TurnFile[];
    /** Sources actually cited in the response, numbered to match the inline
     *  `[n]` citation pills — rendered as a footer. */
    sources: CitedSource[];
    /** Plain text of the turn — the copy/edit source. */
    text: string;
    modelName?: string;
    modelIcon?: string;
    /** This turn is the one currently streaming in. */
    streaming: boolean;
    /** Assistant turn with no visible content yet. */
    pending: boolean;
}

/**
 * Flatten AI SDK messages into pure row items for the mugen list. Reasoning
 * timing parts are paired with their reasoning part here, consecutive
 * reasoning parts merge, and tool/data parts that have no UI are dropped.
 */
export function buildTurns(messages: ThreadMessage[], status: ChatStatus): Turn[] {
    const busy = status === 'streaming' || status === 'submitted';
    const turns: Turn[] = [];

    for (let m = 0; m < messages.length; m++) {
        const message = messages[m];
        const isLast = m === messages.length - 1;
        const role = message.role === 'assistant' ? 'assistant' : 'user';
        const parts = message.parts;

        const blocks: TurnBlock[] = [];
        const files: TurnFile[] = [];
        // Titles the web tools surfaced, keyed by url — used to label the footer
        // sources, which are derived from the citations actually in the text.
        const toolTitles = new Map<string, string>();
        const textPieces: string[] = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (part.type === 'tool-search') {
                const tp = part as ToolPart;
                const done = tp.state === 'output-available';
                const query =
                    tp.input && typeof tp.input.query === 'string' ? tp.input.query : undefined;
                const found = (tp.output?.results ?? []).map(r => ({
                    url: r.url,
                    title: r.title ?? undefined,
                }));
                blocks.push({
                    kind: 'tool-search',
                    status: done ? 'done' : 'running',
                    query,
                    sources: found,
                });
                for (const r of found) if (r.title) toolTitles.set(r.url, r.title);
                continue;
            }

            if (part.type === 'tool-readSite') {
                const tp = part as ToolPart;
                const done = tp.state === 'output-available';
                const url =
                    (tp.input && typeof tp.input.url === 'string' ? tp.input.url : undefined) ??
                    tp.output?.url;
                const title = tp.output?.title ?? undefined;
                if (url) {
                    blocks.push({
                        kind: 'tool-read',
                        status: done ? 'done' : 'running',
                        url,
                        title,
                    });
                    if (title) toolTitles.set(url, title);
                }
                continue;
            }

            if (part.type === 'text') {
                if (part.text) {
                    blocks.push({ kind: 'markdown', text: part.text });
                    textPieces.push(part.text);
                }
                continue;
            }

            if (part.type === 'file') {
                files.push({
                    url: part.url,
                    filename: part.filename,
                    mediaType: part.mediaType,
                });
                continue;
            }

            if (part.type === 'data-error') {
                blocks.push({ kind: 'error', text: String(part.data) });
                continue;
            }

            if (part.type === 'reasoning') {
                const done = part.state === 'done';
                const seconds = reasoningSeconds(parts, i);
                const previous = blocks.at(-1);
                if (previous?.kind === 'reasoning') {
                    previous.text = `${previous.text}\n\n${part.text}`;
                    previous.done = done;
                    if (seconds !== null) {
                        previous.seconds = (previous.seconds ?? 0) + seconds;
                    }
                } else if (part.text) {
                    blocks.push({ kind: 'reasoning', text: part.text, done, seconds });
                }
                continue;
            }

            // Tool calls and the remaining data parts have no UI for now.
        }

        const streaming = isLast && role === 'assistant' && busy;
        const text = textPieces.join('\n');

        turns.push({
            id: message.id,
            messageId: message.id,
            role,
            blocks,
            files,
            sources: parseCitations(text, toolTitles),
            text,
            modelName: message.metadata?.model?.name,
            modelIcon: message.metadata?.model?.icon,
            streaming,
            pending: role === 'assistant' && blocks.length === 0 && streaming,
        });
    }

    // Waiting on the assistant: show a synthetic pending turn.
    const last = messages.at(-1);
    if (busy && last && last.role === 'user') {
        turns.push({
            id: `pending-${last.id}`,
            messageId: last.id,
            role: 'assistant',
            blocks: [],
            files: [],
            sources: [],
            text: '',
            streaming: true,
            pending: true,
        });
    }

    return turns;
}

/** Minimal view of an AI SDK tool-call UI part, across its streaming states. */
type ToolPart = {
    state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
    input?: { query?: string; url?: string };
    output?: {
        url?: string;
        title?: string | null;
        results?: { url: string; title?: string | null }[];
    };
};

// Matches inline citation links `[n](url)` and the legacy `[[n]](url)` form.
// The url group may be empty (the model sometimes omits it on a repeated cite).
const CITATION_RE = /\[\[?(\d+)\]\]?\(([^)]*)\)/g;

/**
 * Build the footer source list from the citations actually present in the
 * response text — so only used sources show, each numbered with the model's own
 * citation number (matching the inline pills). A number's url/title comes from
 * the first citation that carries a non-empty url; numbers never given a url are
 * dropped (nothing to link to).
 */
function parseCitations(text: string, titles: Map<string, string>): CitedSource[] {
    const byNum = new Map<number, CitedSource>();
    CITATION_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = CITATION_RE.exec(text)) !== null) {
        const num = Number(match[1]);
        const url = match[2].trim();
        const existing = byNum.get(num);
        if (!existing) {
            byNum.set(num, { num, url, title: url ? titles.get(url) : undefined });
        } else if (!existing.url && url) {
            existing.url = url;
            existing.title = titles.get(url);
        }
    }
    return [...byNum.values()].filter(s => s.url).sort((a, b) => a.num - b.num);
}

/** Seconds spent reasoning, from the data-reasoning-time parts around index `i`. */
function reasoningSeconds(parts: ThreadMessage['parts'], i: number): number | null {
    let start: number | null = null;
    for (let j = i - 1; j >= 0; j--) {
        const part = parts[j];
        if (part?.type === 'data-reasoning-time' && part.data.type === 'start') {
            start = part.data.timestamp;
            break;
        }
    }
    if (start === null) return null;

    for (let j = i + 1; j < parts.length; j++) {
        const part = parts[j];
        if (part?.type === 'data-reasoning-time' && part.data.type === 'end') {
            return Math.max(0, Math.ceil((part.data.timestamp - start) / 1000));
        }
    }
    return null;
}
