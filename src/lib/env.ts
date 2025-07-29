import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        ZERO_UPSTREAM_DB: z.string().url(),
        AI_GATEWAY_API_KEY: z.string().min(1),
        EXA_API_KEY: z.string().min(1),
        STRIPE_SECRET_KEY: z.string().min(1),
        STRIPE_WEBHOOK_SECRET: z.string().min(1),
        PRO_MONTHLY_PRICE_ID: z.string().min(1),
        CRON_SECRET: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
    },
    clientPrefix: 'VITE_PUBLIC_',
    client: {
        VITE_PUBLIC_API_URL: z.string().url(),
        VITE_PUBLIC_ZERO_URL: z.string().url(),
    },
    runtimeEnv: Object.assign({}, import.meta.env, process.env),
    emptyStringAsUndefined: true,
});
