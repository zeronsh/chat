import { CustomerId, SubscriptionData } from '@/database/types';
import { env } from '@/lib/env';
import * as queries from '@/database/queries';
import Stripe from 'stripe';
import { db } from '@/database';
import { Effect } from 'effect';
import { APIError } from '@/lib/error';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});

export const syncStripeDataToDatabase = (customerId: CustomerId) =>
    Effect.gen(function* () {
        const stripeCustomer = yield* Effect.tryPromise({
            try: () => stripe.customers.retrieve(customerId),
            catch: error =>
                new APIError({
                    status: 500,
                    message: 'Failed to retrieve customer from Stripe',
                    cause: error,
                }),
        });

        if (!('metadata' in stripeCustomer)) {
            return yield* Effect.void;
        }

        const subscriptions = yield* Effect.tryPromise({
            try: () =>
                stripe.subscriptions.list({
                    customer: customerId,
                    limit: 1,
                    status: 'all',
                }),
            catch: error =>
                new APIError({
                    status: 500,
                    message: 'Failed to retrieve subscriptions from Stripe',
                    cause: error,
                }),
        });

        const subscription = subscriptions.data[0];
        if (!subscription) {
            return yield* Effect.void;
        }

        const item = subscription.items.data[0];
        if (!item) {
            return yield* Effect.void;
        }

        const subscriptionData: SubscriptionData = {
            priceId: item.price.id,
            subscriptionId: subscription.id,
            currentPeriodStart: item.current_period_start,
            currentPeriodEnd: item.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            seats: item.quantity ?? 1,
        };

        if (stripeCustomer.metadata.userId) {
            yield* queries.updateUserCustomerSubscription({
                customerId,
                subscription: subscriptionData,
            });
        }

        if (stripeCustomer.metadata.organizationId) {
            yield* queries.updateOrganizationCustomerSubscription({
                customerId,
                subscription: subscriptionData,
            });
        }
    });

export const createStripeCustomer = (email: string, userId: string) =>
    Effect.gen(function* () {
        return yield* Effect.tryPromise({
            try: () =>
                stripe.customers.create({
                    email,
                    metadata: {
                        userId,
                    },
                }),
            catch: error =>
                new APIError({
                    status: 500,
                    message: 'Failed to create customer in Stripe',
                    cause: error,
                }),
        });
    });

export const createStripeCheckoutSession = (
    customerId: string,
    successUrl: string,
    cancelUrl: string,
    priceId: string
) =>
    Effect.gen(function* () {
        return yield* Effect.tryPromise({
            try: () =>
                stripe.checkout.sessions.create({
                    customer: customerId,
                    mode: 'subscription',
                    line_items: [
                        {
                            price: priceId,
                            quantity: 1,
                        },
                    ],
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                }),
            catch: error =>
                new APIError({
                    status: 500,
                    message: 'Failed to create checkout session in Stripe',
                    cause: error,
                }),
        });
    });

export const createStripeBillingPortalSession = (customerId: string, returnUrl: string) =>
    Effect.gen(function* () {
        return yield* Effect.tryPromise({
            try: () =>
                stripe.billingPortal.sessions.create({
                    customer: customerId,
                    return_url: returnUrl,
                }),
            catch: error =>
                new APIError({
                    status: 500,
                    message: 'Failed to create billing portal session in Stripe',
                    cause: error,
                }),
        });
    });
