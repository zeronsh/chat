import { CustomerId, SubscriptionData } from '@/database/types';
import { env } from '@/lib/env';
import * as queries from '@/database/queries';
import Stripe from 'stripe';
import { db } from '@/database';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});

export async function syncStripeDataToDatabase(customerId: CustomerId) {
    const stripeCustomer = await stripe.customers.retrieve(customerId);

    if (!('metadata' in stripeCustomer)) {
        return;
    }

    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: 'all',
    });

    const subscription = subscriptions.data[0];
    const item = subscription.items.data[0];

    const subscriptionData: SubscriptionData = {
        priceId: item.price.id,
        subscriptionId: subscription.id,
        currentPeriodStart: item.current_period_start,
        currentPeriodEnd: item.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        seats: item.quantity ?? 1,
    };

    if (stripeCustomer.metadata.userId) {
        await queries.updateUserCustomerSubscription(db, {
            customerId,
            subscription: subscriptionData,
        });
    }

    if (stripeCustomer.metadata.organizationId) {
        await queries.updateOrganizationCustomerSubscription(db, {
            customerId,
            subscription: subscriptionData,
        });
    }
}
