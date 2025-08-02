import { createServerFileRoute } from '@tanstack/react-start/server';
import { env } from '@/lib/env';
import { Effect, Layer } from 'effect';
import { APIError } from '@/lib/error';
import { SessionLive, Session } from '@/lib/auth';
import { DatabaseLive } from '@/database/effect';
import * as queries from '@/database/queries';
import { UserId, CustomerId } from '@/database/types';
import { createStripeCustomer, createStripeBillingPortalSession } from '@/lib/stripe';
import { nanoid } from '@/lib/utils';

export const ServerRoute = createServerFileRoute('/api/customer-portal').methods({
    GET: async ({ request }) => {
        return customerPortalApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(SessionLive(request)),
            Effect.provide(CustomerPortalRequestLive(request)),
            Effect.provide(DatabaseLive),
            Effect.annotateLogs('requestId', nanoid()),
            Effect.runPromise
        );
    },
});

const customerPortalApi = Effect.gen(function* () {
    const session = yield* Session;
    const customerPortalRequest = yield* CustomerPortalRequest;

    if (session.user.isAnonymous) {
        return yield* new APIError({
            status: 400,
            message: 'anonymous user cannot access billing portal',
        });
    }

    let customer = yield* queries.getUserCustomerByUserId(UserId(session.user.id));

    if (!customer) {
        const stripeCustomer = yield* createStripeCustomer(session.user.email, session.user.id);

        const [newCustomer] = yield* queries.createUserCustomer({
            userId: UserId(session.user.id),
            customerId: CustomerId(stripeCustomer.id),
        });

        customer = newCustomer;
    }

    const successUrl = new URL(`${env.VITE_PUBLIC_API_URL}/api/checkout/success`);

    if (customerPortalRequest.redirectUrl) {
        successUrl.searchParams.set('redirectUrl', customerPortalRequest.redirectUrl);
    }

    const billingPortal = yield* createStripeBillingPortalSession(
        customer.id,
        successUrl.toString()
    );

    if (!billingPortal.url) {
        return yield* new APIError({
            status: 500,
            message: 'billing portal creation failed',
        });
    }

    return Response.redirect(billingPortal.url, 303);
});

interface CustomerPortalRequestShape {
    redirectUrl: string | null;
}

export class CustomerPortalRequest extends Effect.Tag('CustomerPortalRequest')<
    CustomerPortalRequest,
    CustomerPortalRequestShape
>() {}

export const CustomerPortalRequestLive = (request: Request) =>
    Layer.scoped(
        CustomerPortalRequest,
        Effect.succeed({
            redirectUrl: new URL(request.url).searchParams.get('redirectUrl'),
        })
    );
