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

// Reference definitions `[n]: url` (one per line).
const DEFINITION_RE = /^[ \t]*\[(\d+)\]:[ \t]*(\S+)/gm;
// Inline links `[label](url)` — label captured for citation-shape testing.
const INLINE_LINK_RE = /\[([^\]]*?)\]\(([^)]+)\)/g;
// Any `[label]` (optionally followed by a url), but NOT a definition line.
const USAGE_RE = /\[([^\]]*?)\](?!:)(?:\([^)]*\))?/g;

// A citation label is only separators/brackets around one number — "1", ", 5",
// "[1]" (from `[[1]]`). Returns the number, or null for a normal link label.
function citationNum(label: string): number | null {
    const m = label.match(/^[\s,;[\]]*(\d+)[\s,;[\]]*$/);
    return m ? Number(m[1]) : null;
}

/**
 * Build the footer source list from the citations actually present in the
 * response text — so only used sources show, each numbered with the model's own
 * citation number (matching the inline pills). A number's url comes from a
 * reference definition (`[n]: url`) or the first inline link that carries one;
 * cited numbers with no resolvable url are dropped (nothing to link to).
 */
function parseCitations(text: string, titles: Map<string, string>): CitedSource[] {
    const urlByNum = new Map<number, string>();
    for (const m of text.matchAll(DEFINITION_RE)) urlByNum.set(Number(m[1]), m[2].trim());
    for (const m of text.matchAll(INLINE_LINK_RE)) {
        const num = citationNum(m[1]);
        const url = m[2].trim();
        if (num !== null && url && !urlByNum.has(num)) urlByNum.set(num, url);
    }

    const used = new Set<number>();
    for (const m of text.matchAll(USAGE_RE)) {
        const num = citationNum(m[1]);
        if (num !== null) used.add(num);
    }

    const out: CitedSource[] = [];
    for (const num of used) {
        const url = urlByNum.get(num);
        if (url) out.push({ num, url, title: titles.get(url) });
    }
    return out.sort((a, b) => a.num - b.num);
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
