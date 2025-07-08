import { env } from '@/lib/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.ZERO_UPSTREAM_DB,
    },
});
