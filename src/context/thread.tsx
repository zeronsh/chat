import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Thread } from '@/thread';
import { ThreadMessage } from '@/ai/types';
import { ChatInit } from 'ai';
import { nanoid } from '@/lib/utils';
import { ThreadStoreImpl } from '@/thread/store';
import { useThreadIdOrThrow } from '@/hooks/use-params-thread-id';
import { useAppStore } from '@/stores/app';

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
        if (
            init.messages &&
            init.messages.length > 0 &&
            init.messages.length >= thread.store.getState().messages.length
        ) {
            thread.store.getState().setMessages(init.messages);
        }
    }, [init.messages]);

    useEffect(() => {
        if (thread.status === 'streaming') {
            thread.store.getState().setStatus('streaming');
        }
    }, [thread.status]);

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

type PartType = ThreadMessage['parts'][number]['type'];

export function usePart<Return, SelectReturn>(options: {
    id: string;
    index: number;
    type: 'reasoning';
    selector: (
        part: Extract<ThreadMessage['parts'][number], { type: 'reasoning' }> | null
    ) => SelectReturn;
    equalityFn?: (a: Return | null, b: Return | null) => boolean;
}): SelectReturn;

export function usePart<T extends Exclude<PartType, 'reasoning'>, Return, SelectReturn>(options: {
    id: string;
    index: number;
    type: T;
    selector: (part: Extract<ThreadMessage['parts'][number], { type: T }>) => SelectReturn;
    equalityFn?: (a: Return, b: Return) => boolean;
}): SelectReturn;

export function usePart(options: any): any {
    const threadId = useThreadIdOrThrow();
    const part = useAppStore<any>(state => {
        const parts = state.getMessageById(threadId, options.id)!.parts;
        if (parts[1]?.type === 'text' && parts[2]?.type === 'reasoning') {
            const reasoningPart = parts[2];
            const textPart = parts[1];
            parts[1] = reasoningPart;
            parts[2] = textPart;
        }
        const part = Object.assign({}, parts[options.index]);
        if (part.type !== options.type) {
            throw new Error('Part type mismatch');
        }
        if (part.type === 'reasoning') {
            let i = options.index;
            let nextPart = state.getMessageById(threadId, options.id)!.parts[i + 1];
            const prevPart = state.getMessageById(threadId, options.id)!.parts[i - 1];

            if (prevPart && prevPart.type === 'reasoning') {
                return options.selector(null);
            }

            if (nextPart) {
                while (nextPart && nextPart.type === 'reasoning') {
                    part.text += '\n\n' + nextPart.text;
                    part.state = nextPart.state;
                    i++;
                    nextPart = state.getMessageById(threadId, options.id)!.parts[i + 1];
                }
            }
        }

        return options.selector(part as any);
    }, options.equalityFn);

    return part as any;
}
