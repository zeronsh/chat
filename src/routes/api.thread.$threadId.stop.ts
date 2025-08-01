import { createServerFileRoute } from '@tanstack/react-start/server';
import { Effect, Layer } from 'effect';
import { SessionLive } from '@/lib/auth-effects';
import { DatabaseLive } from '@/database/effect';
import { Session } from '@/lib/auth-effects';
import { APIError } from '@/lib/error';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { publish } from '@/lib/redis';
import * as queriesV2 from '@/database/queries.v2';

export const ServerRoute = createServerFileRoute('/api/thread/$threadId/stop').methods({
    async POST({ request, params }) {
        return threadStopPostApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(SessionLive(request)),
            Effect.provide(ThreadStopPostParamsLive({ id: params.threadId })),
            Effect.provide(DatabaseLive),
            Effect.runPromise
        );
    },
});

const threadStopPostApi = Effect.gen(function* () {
    const session = yield* Session;
    const params = yield* ThreadStopPostParams;

    return yield* threadStopPostApiHandler.pipe(
        Effect.annotateLogs('requestId', nanoid()),
        Effect.annotateLogs('userId', session.user.id),
        Effect.annotateLogs('threadId', params.id)
    );
});

const threadStopPostApiHandler = Effect.gen(function* () {
    const session = yield* Session;
    const params = yield* ThreadStopPostParams;

    const thread = yield* queriesV2.getThreadById(params.id);

    if (!thread) {
        console.log('thread not found');
        return yield* new APIError({
            status: 404,
            message: 'Thread not found',
        });
    }

    if (thread.userId !== session.user.id) {
        return yield* new APIError({
            status: 403,
            message: 'You are not allowed to modify this thread',
        });
    }

    yield* publish(`abort:${params.id}`, 'abort');

    return new Response(null, { status: 200 });
});

const ThreadStopPostApiSchema = z.object({
    id: z.string(),
});

class ThreadStopPostParams extends Effect.Tag('ThreadStopPostParams')<
    ThreadStopPostParams,
    z.infer<typeof ThreadStopPostApiSchema>
>() {}

const ThreadStopPostParamsLive = (params: z.infer<typeof ThreadStopPostApiSchema>) =>
    Layer.scoped(
        ThreadStopPostParams,
        Effect.gen(function* () {
            return yield* Effect.try({
                try: () => ThreadStopPostApiSchema.parse(params),
                catch: error => {
                    return new APIError({
                        status: 400,
                        message: 'Invalid request params',
                        cause: error,
                    });
                },
            });
        })
    );
