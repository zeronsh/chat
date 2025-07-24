import { db } from '@/database';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { createServerFileRoute } from '@tanstack/react-start/server';
import * as queries from '@/database/queries';
import { CustomerId, OrganizationId } from '@/database/types';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/checkout/organization').methods({
    GET: async ({ request }) => {
        const url = new URL(request.url);
        const redirectUrl = url.searchParams.get('redirectUrl');
        const seats = Number(url.searchParams.get('seats') ?? 1);

        if (seats < 2) {
            return Response.json('seats must be at least 2', {
                status: 400,
            });
        }

        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return Response.json('unauthorized', {
                status: 401,
            });
        }

        if (!session.session.activeOrganizationId) {
            return Response.json('no active organization', {
                status: 400,
            });
        }

        if (session.user.isAnonymous) {
            return Response.json('anonymous user cannot checkout', {
                status: 400,
            });
        }

        let customer = await queries.getOrganizationCustomerByOrganizationId(
            db,
            OrganizationId(session.session.activeOrganizationId)
        );

        if (!customer) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                metadata: {
                    organizationId: session.session.activeOrganizationId,
                },
            });

            [customer] = await queries.createOrganizationCustomer(db, {
                organizationId: OrganizationId(session.session.activeOrganizationId),
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
                    quantity: seats,
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
