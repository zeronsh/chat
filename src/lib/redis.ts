import { env } from '@/lib/env';
import { Effect, Runtime } from 'effect';
import Redis from 'ioredis';

const subscriber = new Redis(env.REDIS_URL);
const publisher = new Redis(env.REDIS_URL);

export function subscribe(channel: string) {
    return Effect.tryPromise({
        try: () => subscriber.subscribe(channel),
        catch: error => {
            return Effect.logError('Error subscribing to channel', error);
        },
    });
}

export function listen(callback: (channel: string, message: string) => Effect.Effect<void>) {
    return Effect.gen(function* () {
        const runtime = yield* Effect.runtime();
        yield* Effect.try(() =>
            subscriber.on('message', (channel, message) =>
                Runtime.runSync(runtime, callback(channel, message))
            )
        );
    });
}

export function disconnect() {
    return Effect.gen(function* () {
        yield* Effect.try(() => subscriber.disconnect());
    });
}

export function unsubscribe(channel: string) {
    return Effect.gen(function* () {
        yield* Effect.tryPromise(() => subscriber.unsubscribe(channel));
    });
}

export function publish(channel: string, message: string | Buffer) {
    return Effect.gen(function* () {
        yield* Effect.tryPromise(() => publisher.publish(channel, message));
    });
}
