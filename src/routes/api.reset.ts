import { db } from '@/database';
import { usage } from '@/database/app-schema';
import { env } from '@/lib/env';
import { createServerFileRoute } from '@tanstack/react-start/server';

export const ServerRoute = createServerFileRoute('/api/reset').methods({
    GET: async ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        await db
            .update(usage)
            .set({
                credits: 0,
                research: 0,
                search: 0,
            })
            .execute();

        return new Response('OK', { status: 200 });
    },
});
