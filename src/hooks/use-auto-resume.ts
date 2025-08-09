import { useDatabase } from '@/hooks/use-database';
import { useThreadContext, useThreadSelector } from '@/context/thread';
import { useQuery } from '@rocicorp/zero/react';
import { useEffect } from 'react';

export function useAutoResume() {
    const { resumeStream, store } = useThreadContext();
    const id = useThreadSelector(state => state.id);
    const status = useThreadSelector(state => state.status);
    const db = useDatabase();
    const [thread] = useQuery(
        db.query.thread
            .where('id', '=', id ?? '')
            .related('messages', q => q.orderBy('createdAt', 'asc'))
            .one()
    );

    useEffect(() => {
        if (
            thread?.streamId &&
            // Remote status is streaming or submitted
            (thread?.status === 'streaming' || thread?.status === 'submitted') &&
            // Local status is ready
            status === 'ready'
        ) {
            store.getState().setMessages(thread.messages.map(m => m.message) ?? []);
            resumeStream();
        }
    }, [thread?.streamId, thread?.status]);
}
