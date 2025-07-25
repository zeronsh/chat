import { useDatabase } from '@/context/database';
import { useThreadContext, useThreadSelector } from '@/context/thread';
import { useQuery } from '@rocicorp/zero/react';
import { useEffect } from 'react';

export function useAutoResume() {
    const { resumeStream } = useThreadContext();
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
        if (thread?.streamId && status === 'ready') {
            resumeStream();
        }
    }, [thread?.streamId, status]);
}
