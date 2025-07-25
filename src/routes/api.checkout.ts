import { db } from '@/database';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { createServerFileRoute } from '@tanstack/react-start/server';
import * as queries from '@/database/queries';
import { CustomerId, UserId } from '@/database/types';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/checkout').methods({
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
            return Response.json('anonymous user cannot checkout', {
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
        const cancelUrl = redirectUrl ? new URL(redirectUrl) : new URL(env.VITE_PUBLIC_API_URL);

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customer.id,
            mode: 'subscription',
            line_items: [
                {
                    price: env.PRO_MONTHLY_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: successUrl.toString(),
            cancel_url: cancelUrl.toString(),
        });

        if (!checkoutSession.url) {
            return Response.json('checkout session failed', {
                status: 500,
            });
        }

        return Response.redirect(checkoutSession.url, 303);
    },
});
