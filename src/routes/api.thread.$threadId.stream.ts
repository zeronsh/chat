import { createServerFileRoute } from '@tanstack/react-start/server';
import { getResumableStream, prepareResumeThreadContext } from '@/ai/service';
import { Effect, Layer } from 'effect';
import { Session, SessionLive } from '@/lib/auth-effects';
import z from 'zod';
import { APIError } from '@/lib/error';
import { nanoid } from '@/lib/utils';
import { DatabaseLive } from '@/database/effect';

export const ServerRoute = createServerFileRoute('/api/thread/$threadId/stream').methods({
    async GET({ request, params: { threadId } }) {
        return threadResumeStreamApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(SessionLive(request)),
            Effect.provide(ThreadResumeStreamParamsLive({ id: threadId })),
            Effect.provide(DatabaseLive),
            Effect.runPromise
        );
    },
});

const threadResumeStreamApi = Effect.gen(function* () {
    const session = yield* Session;
    const params = yield* ThreadResumeStreamParams;

    return yield* threadResumeStreamApiHandler.pipe(
        Effect.annotateLogs('requestId', nanoid()),
        Effect.annotateLogs('userId', session.user.id),
        Effect.annotateLogs('threadId', params.id)
    );
});

const threadResumeStreamApiHandler = Effect.gen(function* () {
    const session = yield* Session;
    const params = yield* ThreadResumeStreamParams;

    const streamId = yield* prepareResumeThreadContext({
        threadId: params.id,
        userId: session.user.id,
    });

    const stream = yield* getResumableStream(streamId);

    if (!stream) {
        return yield* new APIError({
            status: 404,
            message: 'Stream not found',
        });
    }

    return new Response(stream);
});

const ThreadResumeStreamApiSchema = z.object({
    id: z.string(),
});

class ThreadResumeStreamParams extends Effect.Tag('ThreadResumeStreamParams')<
    ThreadResumeStreamParams,
    z.infer<typeof ThreadResumeStreamApiSchema>
>() {}

const ThreadResumeStreamParamsLive = (params: z.infer<typeof ThreadResumeStreamApiSchema>) =>
    Layer.scoped(
        ThreadResumeStreamParams,
        Effect.gen(function* () {
            return yield* Effect.try({
                try: () => ThreadResumeStreamApiSchema.parse(params),
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
