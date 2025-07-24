import { db } from '@/database';
import { getUserCustomer } from '@/database/queries';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { createServerFileRoute } from '@tanstack/react-start/server';
import * as queries from '@/database/queries';
import { CustomerId } from '@/database/types';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/checkout').methods({
    GET: async ({ request }) => {
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

        let customer = await queries.getUserCustomer(db, session.user.id);

        if (!customer) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                metadata: {
                    userId: session.user.id,
                },
            });

            [customer] = await queries.createUserCustomer(db, {
                userId: session.user.id,
                customerId: CustomerId(stripeCustomer.id),
            });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customer.id,
            mode: 'subscription',
            line_items: [
                {
                    price: env.PRO_MONTHLY_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${env.VITE_PUBLIC_API_URL}/checkout/success`,
            cancel_url: `${env.VITE_PUBLIC_API_URL}`,
        });

        if (!checkoutSession.url) {
            return Response.json('checkout session failed', {
                status: 500,
            });
        }

        return Response.redirect(checkoutSession.url, 303);
    },
});
