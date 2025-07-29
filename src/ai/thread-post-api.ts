import { Effect } from 'effect';

export const threadPostApi = Effect.fn('threadPostApi')(function* (request: Request) {
    const json = yield* Effect.tryPromise(() => request.json());
});
