import { ThreadMessage } from '@/ai/types';
import { ChatStatus } from 'ai';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export type Thread = {
    id: string;
    status: ChatStatus;
    messages: ThreadMessage[];
    title: string;
    createdAt: number;
    updatedAt: number;
};

export type AppStore = {
    threads: Record<string, Thread>;
    // setters
    setThreads: (threads: Record<string, Thread>) => void;

    setMessagesByThreadId: (threadId: string, messages: ThreadMessage[]) => void;
    setStatusByThreadId: (threadId: string, status: ChatStatus) => void;
    pushMessageByThreadId: (threadId: string, message: ThreadMessage) => void;
    popMessageByThreadId: (threadId: string) => void;
    replaceMessageByThreadId: (threadId: string, index: number, message: ThreadMessage) => void;

    // getters
    getAllThreads: () => Thread[];
    getThreadById: (id: string | undefined) => Thread | undefined;
    getMessageIdsByThreadId: (threadId: string | undefined) => string[];
    getMessagesByThreadId: (threadId: string) => ThreadMessage[];
    getMessageById: (threadId: string, id: string) => ThreadMessage | undefined;
    getMessageMetadataById: (threadId: string, id: string) => ThreadMessage['metadata'] | undefined;
};

export let useAppStore: ReturnType<typeof createAppStore> = createAppStore({ threads: {} });

function createAppStore(init: { threads: Record<string, Thread> }) {
    const store = create<AppStore>()(
        devtools(
            subscribeWithSelector((set, get) => ({
                ...init,
                setThreads: (threads: Record<string, Thread>) => {
                    set({ threads }, false, 'app/setThreads');
                },
                setMessagesByThreadId: (threadId: string, messages: ThreadMessage[]) => {
                    const currentThreads = get().threads;
                    if (!currentThreads[threadId]) {
                        // Create thread with default values if it doesn't exist
                        const now = Date.now();
                        currentThreads[threadId] = {
                            id: threadId,
                            status: 'submitted',
                            messages: [],
                            title: '',
                            createdAt: now,
                            updatedAt: now,
                        };
                    }

                    set(
                        {
                            threads: {
                                ...currentThreads,
                                [threadId]: { ...currentThreads[threadId], messages },
                            },
                        },
                        false,
                        'app/setMessagesByThreadId'
                    );
                },
                setStatusByThreadId: (threadId: string, status: ChatStatus) => {
                    const currentThreads = get().threads;
                    if (!currentThreads[threadId]) {
                        // Create thread with default values if it doesn't exist
                        const now = Date.now();
                        currentThreads[threadId] = {
                            id: threadId,
                            status: 'submitted',
                            messages: [],
                            title: '',
                            createdAt: now,
                            updatedAt: now,
                        };
                    }

                    set(
                        {
                            threads: {
                                ...currentThreads,
                                [threadId]: { ...currentThreads[threadId], status },
                            },
                        },
                        false,
                        'app/setStatusByThreadId'
                    );
                },
                pushMessageByThreadId: (threadId: string, message: ThreadMessage) => {
                    const currentThreads = get().threads;
                    if (!currentThreads[threadId]) {
                        // Create thread with default values if it doesn't exist
                        const now = Date.now();
                        currentThreads[threadId] = {
                            id: threadId,
                            status: 'submitted',
                            messages: [],
                            title: '',
                            createdAt: now,
                            updatedAt: now,
                        };
                    }

                    set(
                        {
                            threads: {
                                ...currentThreads,
                                [threadId]: {
                                    ...currentThreads[threadId],
                                    messages: [...currentThreads[threadId].messages, message],
                                },
                            },
                        },
                        false,
                        'app/pushMessageByThreadId'
                    );
                },
                popMessageByThreadId: (threadId: string) => {
                    const currentThreads = get().threads;
                    if (!currentThreads[threadId]) {
                        // Create thread with default values if it doesn't exist
                        const now = Date.now();
                        currentThreads[threadId] = {
                            id: threadId,
                            status: 'submitted',
                            messages: [],
                            title: '',
                            createdAt: now,
                            updatedAt: now,
                        };
                    }

                    set(
                        {
                            threads: {
                                ...currentThreads,
                                [threadId]: {
                                    ...currentThreads[threadId],
                                    messages: currentThreads[threadId].messages.slice(0, -1),
                                },
                            },
                        },
                        false,
                        'app/popMessageByThreadId'
                    );
                },
                replaceMessageByThreadId: (
                    threadId: string,
                    index: number,
                    newMessage: ThreadMessage
                ) => {
                    const currentThreads = get().threads;
                    if (!currentThreads[threadId]) {
                        // Create thread with default values if it doesn't exist
                        const now = Date.now();
                        currentThreads[threadId] = {
                            id: threadId,
                            status: 'submitted',
                            messages: [],
                            title: '',
                            createdAt: now,
                            updatedAt: now,
                        };
                    }

                    set(
                        {
                            threads: {
                                ...currentThreads,
                                [threadId]: {
                                    ...currentThreads[threadId],
                                    messages: currentThreads[threadId].messages.map((message, i) =>
                                        i === index ? structuredClone(newMessage) : message
                                    ),
                                },
                            },
                        },
                        false,
                        'app/replaceMessageByThreadId'
                    );
                },
                getAllThreads: () => {
                    return Object.values(get().threads).sort((a, b) => b.createdAt - a.createdAt);
                },
                getThreadById: (id: string | undefined) => {
                    if (!id) return undefined;
                    return get().threads[id];
                },
                getMessageIdsByThreadId: (threadId: string | undefined) => {
                    if (!threadId) return [];
                    if (!get().threads[threadId]) return [];
                    return get().threads[threadId].messages.map(message => message.id);
                },
                getMessagesByThreadId: (threadId: string) => {
                    return get().threads[threadId].messages ?? [];
                },
                getMessageById: (threadId: string, id: string) => {
                    return get().threads[threadId].messages.find(message => message.id === id);
                },
                getMessageMetadataById: (threadId: string, id: string) => {
                    return get().threads[threadId].messages.find(message => message.id === id)
                        ?.metadata;
                },
            }))
        )
    );

    return store;
}
