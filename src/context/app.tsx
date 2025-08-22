import { useSession } from '@/hooks/use-session';
import { useAppStore } from '@/stores/app';
import { setZero, zero } from '@/zero/zero';
import { useEffect, useRef, useState } from 'react';
import { SimpleListener } from '@/zero/listener';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const session = useSession();
    const setThreads = useAppStore(state => state.setThreads);
    const { current: listeners } = useRef<Record<string, SimpleListener<any, any, any>>>({});

    useEffect(() => {
        if (session && session.data) {
            setZero({ userID: session.data.user.id });

            if (listeners['threads']) {
                listeners['threads'].destroy();
            }

            if (!zero) return;

            listeners['threads'] = new SimpleListener({
                zero,
                query: zero.query.thread
                    .where('userId', '=', zero.userID)
                    .related('messages', q => q.orderBy('createdAt', 'asc')),

                listener(data) {
                    const threads = Object.fromEntries(
                        data.map(thread => [
                            thread.id,
                            structuredClone({
                                id: thread.id,
                                title: thread.title!,
                                status: thread.status!,
                                messages: thread.messages.map(message => message.message),
                                createdAt: thread.createdAt!,
                                updatedAt: thread.updatedAt!,
                            }),
                        ])
                    );
                    setThreads(threads);
                },
            });
        }
    }, [session]);

    return children;
}
