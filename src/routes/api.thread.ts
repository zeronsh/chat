import { createServerFileRoute } from '@tanstack/react-start/server';
import { threadPostApi, ThreadPostBodyLive } from '@/ai/thread-post-api';
import { Effect } from 'effect';
import { SessionLive } from '@/lib/auth-effects';

export const ServerRoute = createServerFileRoute('/api/thread').methods({
    async POST({ request }) {
        return threadPostApi.pipe(
            Effect.scoped,
            Effect.catchAll(e => e.response),
            Effect.provide(SessionLive(request)),
            Effect.provide(ThreadPostBodyLive(request)),
            Effect.runPromise
        );
    },
});
