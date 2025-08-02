import { createServerFileRoute } from '@tanstack/react-start/server';
import { env } from '@/lib/env';
import { Effect, Layer } from 'effect';
import { APIError } from '@/lib/error';
import { SessionLive, Session } from '@/lib/auth';
import * as queries from '@/database/queries';
import { UserId, CustomerId } from '@/database/types';
import { createStripeCustomer, createStripeCheckoutSession } from '@/lib/stripe';
import { nanoid } from '@/lib/utils';
import { DatabaseLive } from '@/database/effect';

export const ServerRoute = createServerFileRoute('/api/checkout').methods({
    GET: async ({ request }) => {
        return checkoutApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(SessionLive(request)),
            Effect.provide(CheckoutRequestLive(request)),
            Effect.provide(DatabaseLive),
            Effect.annotateLogs('requestId', nanoid()),
            Effect.runPromise
        );
    },
});

const checkoutApi = Effect.gen(function* () {
    const session = yield* Session;
    const checkoutRequest = yield* CheckoutRequest;

    if (session.user.isAnonymous) {
        return yield* new APIError({
            status: 400,
            message: 'anonymous user cannot checkout',
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
    if (checkoutRequest.redirectUrl) {
        successUrl.searchParams.set('redirectUrl', checkoutRequest.redirectUrl);
    }
    const cancelUrl = checkoutRequest.redirectUrl
        ? new URL(checkoutRequest.redirectUrl)
        : new URL(env.VITE_PUBLIC_API_URL);

    const checkoutSession = yield* createStripeCheckoutSession(
        customer.id,
        successUrl.toString(),
        cancelUrl.toString(),
        env.PRO_MONTHLY_PRICE_ID
    );

    if (!checkoutSession.url) {
        return yield* new APIError({
            status: 500,
            message: 'checkout session failed',
        });
    }

    return Response.redirect(checkoutSession.url, 303);
});

interface CheckoutRequestShape {
    redirectUrl: string | null;
}

class CheckoutRequest extends Effect.Tag('CheckoutRequest')<
    CheckoutRequest,
    CheckoutRequestShape
>() {}

export const CheckoutRequestLive = (request: Request) =>
    Layer.scoped(
        CheckoutRequest,
        Effect.succeed({
            redirectUrl: new URL(request.url).searchParams.get('redirectUrl'),
        })
    );
