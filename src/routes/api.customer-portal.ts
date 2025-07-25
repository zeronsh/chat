import { db } from '@/database';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { createServerFileRoute } from '@tanstack/react-start/server';
import * as queries from '@/database/queries';
import { CustomerId, UserId } from '@/database/types';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/customer-portal').methods({
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

        if (session.user.isAnonymous) {
            return Response.json('anonymous user cannot access billing portal', {
                status: 400,
            });
        }

        let customer = await queries.getUserCustomerByUserId(db, UserId(session.user.id));

        if (!customer) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                metadata: {
                    userId: session.user.id,
                },
            });

            [customer] = await queries.createUserCustomer(db, {
                userId: UserId(session.user.id),
                customerId: CustomerId(stripeCustomer.id),
            });
        }

        const successUrl = new URL(`${env.VITE_PUBLIC_API_URL}/api/checkout/success`);

        if (redirectUrl) {
            successUrl.searchParams.set('redirectUrl', redirectUrl);
        }

        const billingPortal = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: successUrl.toString(),
        });

        if (!billingPortal.url) {
            return Response.json('billing portal creation failed', {
                status: 500,
            });
        }

        return Response.redirect(billingPortal.url, 303);
    },
});
