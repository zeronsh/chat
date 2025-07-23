import { CustomerId, SubscriptionId } from '@/database/types';
import { env } from '@/lib/env';
import * as queries from '@/database/queries';
import Stripe from 'stripe';
import { db } from '@/database';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});

export async function syncStripeDataToDatabase(customerId: CustomerId) {
    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: 'all',
        expand: ['data.default_payment_method'],
    });

    const subscription = subscriptions.data[0];
    const item = subscription.items.data[0];

    return queries.upsertSubscription(db, {
        id: SubscriptionId(subscription.id),
        customerId,
        data: {
            priceId: subscription.items.data[0].price.id,
            subscriptionId: subscription.id,
            currentPeriodStart: item.current_period_start,
            currentPeriodEnd: item.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            seats: item.quantity ?? 1,
            paymentMethod:
                subscription.default_payment_method &&
                typeof subscription.default_payment_method !== 'string'
                    ? {
                          brand: subscription.default_payment_method.card?.brand,
                          last4: subscription.default_payment_method.card?.last4,
                      }
                    : undefined,
        },
    });
}
