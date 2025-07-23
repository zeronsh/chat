import { CustomerId } from '@/database/types';
import { env } from '@/lib/env';
import { stripe, syncStripeDataToDatabase } from '@/lib/stripe';
import { createServerFileRoute } from '@tanstack/react-start/server';
import Stripe from 'stripe';

export const ServerRoute = createServerFileRoute('/api/webhook/stripe').methods({
    POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return Response.json('stripe signature missing', {
                status: 400,
            });
        }

        const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

        if (ALLOWED_EVENTS.includes(event.type)) {
            const data = event.data.object as {
                customer?: string;
            };

            if (!data.customer) {
                console.error('stripe customer is not a string');
                return;
            }

            await syncStripeDataToDatabase(CustomerId(data.customer));
        }

        return Response.json({ message: 'received' }, { status: 200 });
    },
});

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
