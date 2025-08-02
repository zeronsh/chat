import { env } from '@/lib/env';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { Effect, Layer } from 'effect';
import { APIError } from '@/lib/error';
import { DatabaseLive } from '@/database/effect';
import * as queries from '@/database/queries';
import { nanoid } from '@/lib/utils';

export const ServerRoute = createServerFileRoute('/api/reset').methods({
    GET: async ({ request }) => {
        return resetApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(ResetRequestLive(request)),
            Effect.provide(DatabaseLive),
            Effect.annotateLogs('requestId', nanoid()),
            Effect.runPromise
        );
    },
});

const resetApi = Effect.gen(function* () {
    const resetRequest = yield* ResetRequest;

    if (!resetRequest.isAuthorized) {
        return yield* new APIError({
            status: 401,
            message: 'Unauthorized',
        });
    }

    yield* queries.resetUsage();

    return new Response('OK', { status: 200 });
});

export class ResetRequest extends Effect.Tag('ResetRequest')<
    ResetRequest,
    {
        readonly isAuthorized: boolean;
    }
>() {}

export const ResetRequestLive = (request: Request) =>
    Layer.scoped(
        ResetRequest,
        Effect.succeed({
            isAuthorized: request.headers.get('Authorization') === `Bearer ${env.CRON_SECRET}`,
        })
    );
