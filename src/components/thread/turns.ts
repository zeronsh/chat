import type { ThreadMessage } from '@/ai/types';
import type { ChatStatus } from 'ai';

export type TurnBlock =
    | { kind: 'markdown'; text: string }
    | { kind: 'reasoning'; text: string; done: boolean; seconds: number | null }
    | { kind: 'error'; text: string };

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
        const textPieces: string[] = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

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

        turns.push({
            id: message.id,
            messageId: message.id,
            role,
            blocks,
            files,
            text: textPieces.join('\n'),
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
            text: '',
            streaming: true,
            pending: true,
        });
    }

    return turns;
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
