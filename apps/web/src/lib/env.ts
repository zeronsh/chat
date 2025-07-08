import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        ZERO_UPSTREAM_DB: z.string().url(),
        AI_GATEWAY_API_KEY: z.string().min(1),
    },
    clientPrefix: 'VITE_PUBLIC_',
    client: {
        VITE_PUBLIC_API_URL: z.string().url(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
