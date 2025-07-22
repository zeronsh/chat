import { createServerFileRoute } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth';
import { ThreadError } from '@/ai/error';
import { prepareResumeThread, streamContext } from '@/ai/service';
import { createResumeStreamResponse } from '@/ai/stream';

export const ServerRoute = createServerFileRoute('/api/thread/$threadId/stream').methods({
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
