import { type ChatStatus, type UIMessage } from 'ai';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export type FileAttachment = {
    type: 'file';
    url: string;
    filename: string;
    mediaType: string;
};

export interface ThreadStoreImpl<UI_MESSAGE extends UIMessage> {
    id?: string;
    messages: UI_MESSAGE[];
    status: ChatStatus;
    error: Error | undefined;

    editingMessageId: string | undefined;
    setEditingMessageId: (editingMessageId: string | undefined) => void;
    input: string;
    setInput: (input: string) => void;
    pendingFileCount: number;
    setPendingFileCount: (pendingFileCount: number | ((prev: number) => number)) => void;
    attachments: FileAttachment[];
    setAttachments: (attachments: FileAttachment[]) => void;

    setMessages: (messages: UI_MESSAGE[] | ((prev: UI_MESSAGE[]) => UI_MESSAGE[])) => void;
    setStatus: (status: ChatStatus) => void;
    setError: (error: Error | undefined) => void;
    pushMessage: (message: UI_MESSAGE) => void;
    popMessage: () => void;
    replaceMessage: (index: number, message: UI_MESSAGE) => void;
}

export function createThreadStore<UI_MESSAGE extends UIMessage>(init: {
    id?: string;
    messages: UI_MESSAGE[];
}) {
    return create<ThreadStoreImpl<UI_MESSAGE>>()(
        devtools(
            subscribeWithSelector((set, get) => {
                const setMessages = (
                    messagesOrUpdater: UI_MESSAGE[] | ((prev: UI_MESSAGE[]) => UI_MESSAGE[])
                ) => {
                    const messages =
                        typeof messagesOrUpdater === 'function'
                            ? messagesOrUpdater(get().messages)
                            : messagesOrUpdater;

                    set({ messages }, false, 'thread/setMessages');
                };

                // Each streamed commit makes mugen re-measure the *whole* answer
                // row (it re-runs render + the analytic walk for every row on any
                // items change — there's no per-row memo), which is O(answer
                // length). Committing on every chunk is therefore O(n²) for a long
                // answer and freezes the main thread. Coalesce instead: commit on
                // the leading edge, then at most once per `wait`, scaling `wait`
                // with the longest message so short replies stay snappy and long
                // ones re-measure far less often. (The real fix is per-block
                // measured-height memo in mugen-markdown so a growing row only
                // re-measures its tail; this bounds the cost until then.)
                let lastCommitAt = 0;
                let trailingTimer: ReturnType<typeof setTimeout> | null = null;
                let pendingArg: UI_MESSAGE[] | ((prev: UI_MESSAGE[]) => UI_MESSAGE[]) | null = null;

                const commitInterval = () => {
                    let longest = 0;
                    for (const message of get().messages) {
                        let chars = 0;
                        for (const part of message.parts) {
                            if (part.type === 'text') chars += part.text.length;
                        }
                        if (chars > longest) longest = chars;
                    }
                    if (longest > 32_000) return 550; // ~5k+ words
                    if (longest > 8_000) return 280; // ~1.3k+ words
                    return 90;
                };

                const throttledSetMessages = (
                    messagesOrUpdater: UI_MESSAGE[] | ((prev: UI_MESSAGE[]) => UI_MESSAGE[])
                ) => {
                    pendingArg = messagesOrUpdater;
                    const wait = commitInterval();
                    const elapsed = Date.now() - lastCommitAt;
                    if (elapsed >= wait) {
                        lastCommitAt = Date.now();
                        if (trailingTimer) {
                            clearTimeout(trailingTimer);
                            trailingTimer = null;
                        }
                        const arg = pendingArg;
                        pendingArg = null;
                        setMessages(arg);
                    } else if (!trailingTimer) {
                        trailingTimer = setTimeout(() => {
                            lastCommitAt = Date.now();
                            trailingTimer = null;
                            if (pendingArg !== null) {
                                const arg = pendingArg;
                                pendingArg = null;
                                setMessages(arg);
                            }
                        }, wait - elapsed);
                    }
                };

                return {
                    id: init.id,
                    messages: init.messages,
                    status: 'ready',
                    error: undefined,
                    input: '',
                    pendingFileCount: 0,
                    editingMessageId: undefined,
                    setEditingMessageId: (editingMessageId: string | undefined) =>
                        set({ editingMessageId }, false, 'thread/setEditingMessageId'),
                    setInput: (input: string) => set({ input }, false, 'thread/setInput'),
                    setPendingFileCount: (
                        pendingFileCount: number | ((prev: number) => number)
                    ) => {
                        set(
                            {
                                pendingFileCount:
                                    typeof pendingFileCount === 'function'
                                        ? pendingFileCount(get().pendingFileCount)
                                        : pendingFileCount,
                            },
                            false,
                            'thread/setPendingFileCount'
                        );
                    },

                    attachments: [],
                    setAttachments: (attachments: FileAttachment[]) =>
                        set({ attachments }, false, 'thread/setAttachments'),
                    setStatus: (status: ChatStatus) => set({ status }, false, 'thread/setStatus'),
                    setError: (error: Error | undefined) =>
                        set({ error }, false, 'thread/setError'),
                    pushMessage: (message: UI_MESSAGE) => {
                        get().setMessages([...get().messages, message]);
                    },
                    popMessage: () => {
                        get().setMessages(get().messages.slice(0, -1));
                    },
                    replaceMessage: (index: number, message: UI_MESSAGE) => {
                        // The AI SDK keeps ONE streaming message object and mutates
                        // it in place (parts.push, text += delta), calling this on
                        // every chunk. structuredClone here deep-copied the entire
                        // growing message every chunk — O(n) × thousands of chunks =
                        // O(n²), the cause of the long-answer streaming lag. Store the
                        // reference instead: the array is still rebuilt immutably so
                        // React re-renders, and nothing reads raw messages directly —
                        // the UI derives fresh Turn objects via buildTurns each tick.
                        get().setMessages([
                            ...get().messages.slice(0, index),
                            message,
                            ...get().messages.slice(index + 1),
                        ]);
                    },
                    setMessages: (
                        messagesOrUpdater: UI_MESSAGE[] | ((prev: UI_MESSAGE[]) => UI_MESSAGE[])
                    ) => {
                        if (get().status === 'streaming') {
                            throttledSetMessages(messagesOrUpdater);
                            return;
                        }
                        // A direct (non-streaming) write wins over any coalesced
                        // commit still in flight, so a late trailing timer can't
                        // clobber it with older content.
                        if (trailingTimer) {
                            clearTimeout(trailingTimer);
                            trailingTimer = null;
                        }
                        pendingArg = null;
                        setMessages(messagesOrUpdater);
                    },
                };
            })
        )
    );
}

export type ThreadStore<UI_MESSAGE extends UIMessage> = ReturnType<
    typeof createThreadStore<UI_MESSAGE>
>;
