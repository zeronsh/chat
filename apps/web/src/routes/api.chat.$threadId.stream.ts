import { createServerFileRoute } from '@tanstack/react-start/server';
import { createResumeStreamResponse } from '@zeronsh/ai';
import z from 'zod';
import { auth } from '@/lib/auth';
import { ThreadError } from '@/lib/error';
import { prepareResumeThread, streamContext } from '@/lib/chat';

export const ServerRoute = createServerFileRoute('/api/chat/$threadId/stream').methods({
    async GET({ request, params: { threadId } }) {
        return createResumeStreamResponse({
            streamContext,
            onPrepare: async () => {
                const session = await auth.api.getSession({
                    headers: request.headers,
                });

                if (!session) {
                    throw new ThreadError('NotAuthorized');
                }

                const streamId = await prepareResumeThread({
                    threadId,
                    userId: session.user.id,
                });

                return streamId;
            },
        });
    },
});
