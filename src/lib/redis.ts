import { env } from '@/lib/env';
import { Layer } from 'effect';
import { RedisConnectionOptionsLive, RedisPubSubLive } from 'effect-redis';

const conn = RedisConnectionOptionsLive({
    url: env.REDIS_URL,
});

export const RedisLive = RedisPubSubLive.pipe(Layer.provide(conn));
