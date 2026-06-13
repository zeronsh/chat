import { createContext, useContext, useEffect, useMemo } from 'react';
import { Thread } from '@/thread';
import { ThreadMessage } from '@/ai/types';
import { ChatInit } from 'ai';
import { nanoid } from '@/lib/utils';
import { ThreadStoreImpl } from '@/thread/store';

const ThreadContext = createContext<Thread<ThreadMessage> | null>(null);

const threads = new Map<string, Thread<ThreadMessage>>();

export function ThreadProvider({
    children,
    ...init
}: {
    children: React.ReactNode;
} & ChatInit<ThreadMessage>) {
    const generateId = init.generateId ?? nanoid;

    const id = useMemo(() => {
        if (init.id) {
            return init.id;
        }

        return generateId();
    }, [init.id, generateId]);

    const thread = useMemo(() => {
        if (threads.has(id)) {
            return threads.get(id)!;
        }

        const thread = new Thread<ThreadMessage>({ ...init, id });

        threads.set(id, thread);

        return thread;
    }, [id]);

    useEffect(() => {
        if (
            init.messages &&
            init.messages.length > 0 &&
            init.messages.length >= thread.store.getState().messages.length
        ) {
            thread.store.getState().setMessages(init.messages);
        }
    }, [init.messages, id]);

    return <ThreadContext.Provider value={thread}>{children}</ThreadContext.Provider>;
}

export function useThreadContext() {
    const thread = useContext(ThreadContext);
    if (!thread) {
        throw new Error('useThreadContext must be used within a ThreadProvider');
    }
    return thread;
}

export function useThreadSelector<T>(
    selector: (state: ThreadStoreImpl<ThreadMessage>) => T,
    equalityFn?: (a: T, b: T) => boolean
) {
    return useThreadContext().store(selector, equalityFn);
}
