import { createServerFileRoute } from '@tanstack/react-start/server';
import { env } from '@/lib/env';
import { Effect, Layer } from 'effect';
import { APIError } from '@/lib/error';
import { SessionLive, Session } from '@/lib/auth';
import { DatabaseLive } from '@/database/effect';
import * as queries from '@/database/queries';
import { UserId } from '@/database/types';
import { syncStripeDataToDatabase } from '@/lib/stripe';
import { nanoid } from '@/lib/utils';

export const ServerRoute = createServerFileRoute('/api/checkout/success').methods({
    GET: async ({ request }) => {
        return checkoutSuccessApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(SessionLive(request)),
            Effect.provide(CheckoutSuccessRequestLive(request)),
            Effect.provide(DatabaseLive),
            Effect.annotateLogs('requestId', nanoid()),
            Effect.runPromise
        );
    },
});

const checkoutSuccessApi = Effect.gen(function* () {
    const session = yield* Session;
    const checkoutSuccessRequest = yield* CheckoutSuccessRequest;

    const customer = yield* queries.getUserCustomerByUserId(UserId(session.user.id));

    if (!customer) {
        return Response.redirect(checkoutSuccessRequest.redirectUrl ?? '/', 303);
    }

    yield* syncStripeDataToDatabase(customer.id);

    return Response.redirect(checkoutSuccessRequest.redirectUrl ?? env.VITE_PUBLIC_API_URL, 303);
});

interface CheckoutSuccessRequestShape {
    redirectUrl: string | null;
}

export class CheckoutSuccessRequest extends Effect.Tag('CheckoutSuccessRequest')<
    CheckoutSuccessRequest,
    CheckoutSuccessRequestShape
>() {}

export const CheckoutSuccessRequestLive = (request: Request) =>
    Layer.scoped(
        CheckoutSuccessRequest,
        Effect.succeed({
            redirectUrl: new URL(request.url).searchParams.get('redirectUrl'),
        })
    );
