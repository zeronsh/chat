import { db } from '@/database';
import { auth } from '@/lib/auth';
import { syncStripeDataToDatabase } from '@/lib/stripe';
import { createServerFileRoute } from '@tanstack/react-start/server';
import * as queries from '@/database/queries';
import { UserId } from '@/database/types';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/checkout/success').methods({
    GET: async ({ request }) => {
        const url = new URL(request.url);
        const redirectUrl = url.searchParams.get('redirectUrl');

        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return Response.json('unauthorized', {
                status: 401,
            });
        }
        const customer = await queries.getUserCustomerByUserId(db, UserId(session.user.id));

        if (!customer) {
            return Response.redirect(redirectUrl ?? '/', 303);
        }

        await syncStripeDataToDatabase(customer.id);

        return Response.redirect(redirectUrl ?? env.VITE_PUBLIC_API_URL, 303);
    },
});
