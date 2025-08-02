import { CustomerId } from '@/database/types';
import { env } from '@/lib/env';
import { stripe, syncStripeDataToDatabase } from '@/lib/stripe';
import { createServerFileRoute } from '@tanstack/react-start/server';
import Stripe from 'stripe';
import { Effect, Layer } from 'effect';
import { APIError } from '@/lib/error';
import { nanoid } from '@/lib/utils';
import { DatabaseLive } from '@/database/effect';

export const ServerRoute = createServerFileRoute('/api/webhook/stripe').methods({
    POST: async ({ request }) => {
        return stripeWebhookApi.pipe(
            Effect.scoped,
            APIError.map({
                status: 500,
                message: 'Uncaught error',
            }),
            Effect.catchAll(e => e.response),
            Effect.provide(StripeWebhookRequestLive(request)),
            Effect.provide(DatabaseLive),
            Effect.annotateLogs('requestId', nanoid()),
            Effect.runPromise
        );
    },
});

const stripeWebhookApi = Effect.gen(function* () {
    const request = yield* StripeWebhookRequest;
    const body = request.body;
    const signature = request.signature;

    if (!signature) {
        return yield* new APIError({
            status: 400,
            message: 'stripe signature missing',
        });
    }

    const event = yield* Effect.try({
        try: () => stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET),
        catch: error =>
            new APIError({
                status: 400,
                message: 'Invalid webhook signature',
                cause: error,
            }),
    });

    if (ALLOWED_EVENTS.includes(event.type)) {
        const data = event.data.object as {
            customer?: string;
        };

        if (!data.customer) {
            yield* Effect.logError('stripe customer is not a string');
            return yield* Effect.void;
        }

        yield* syncStripeDataToDatabase(CustomerId(data.customer));
    }

    return Response.json({ message: 'received' }, { status: 200 });
});

type StripeWebhookRequestShape = {
    body: string;
    signature: string | null;
};

class StripeWebhookRequest extends Effect.Tag('StripeWebhookRequest')<
    StripeWebhookRequest,
    StripeWebhookRequestShape
>() {}

const StripeWebhookRequestLive = (request: Request) =>
    Layer.scoped(
        StripeWebhookRequest,
        Effect.gen(function* () {
            const body = yield* Effect.tryPromise({
                try: () => request.text(),
                catch: error =>
                    new APIError({
                        status: 400,
                        message: 'Invalid request body',
                        cause: error,
                    }),
            });

            return {
                body,
                signature: request.headers.get('stripe-signature'),
            };
        })
    );

const ALLOWED_EVENTS: Stripe.Event.Type[] = [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'customer.subscription.paused',
    'customer.subscription.resumed',
    'customer.subscription.pending_update_applied',
    'customer.subscription.pending_update_expired',
    'customer.subscription.trial_will_end',
    'invoice.paid',
    'invoice.payment_failed',
    'invoice.payment_action_required',
    'invoice.upcoming',
    'invoice.marked_uncollectible',
    'invoice.payment_succeeded',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.canceled',
];
