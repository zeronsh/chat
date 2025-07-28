import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

    const [thread] = useState(() => {
        if (threads.has(id)) {
            return threads.get(id)!;
        }

        const thread = new Thread<ThreadMessage>({ ...init, id });

        threads.set(id, thread);

        return thread;
    });

    useEffect(() => {
        if (init.messages && init.messages.length > 0) {
            thread.store.getState().setMessages(init.messages);
        }
    }, [init.messages]);

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

export function usePart<T extends ThreadMessage['parts'][number]['type'], Return>(options: {
    id: string;
    index: number;
    type: T;
    selector: (part: Extract<ThreadMessage['parts'][number], { type: T }>) => Return;
    equalityFn?: (a: Return, b: Return) => boolean;
}): Return {
    const part = useThreadSelector(state => {
        const part = state.messageMap[options.id].parts[options.index];
        if (part.type !== options.type) {
            throw new Error('Part type mismatch');
        }
        return options.selector(part as Extract<ThreadMessage['parts'][number], { type: T }>);
    }, options.equalityFn);

    return part;
}
