import { auth } from '@/lib/auth';
import { APIError } from '@/lib/error';
import { Effect } from 'effect';

export const getSession = Effect.fn('getSession')(function* (request: Request) {
    const session = yield* Effect.tryPromise({
        try: () => {
            return auth.api.getSession({
                headers: request.headers,
            });
        },
        catch: error => {
            return new APIError({
                status: 500,
                message: 'Failed to get session',
                cause: error,
            });
        },
    });

    if (!session) {
        throw new APIError({
            status: 401,
            message: 'Unauthorized',
        });
    }

    return session;
});
