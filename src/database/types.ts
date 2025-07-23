import { Brand } from 'effect';

export type CustomerId = string & Brand.Brand<'CustomerId'>;
export const CustomerId = Brand.nominal<CustomerId>();
export type SubscriptionId = string & Brand.Brand<'SubscriptionId'>;
export const SubscriptionId = Brand.nominal<SubscriptionId>();

export type SubscriptionData = {
    priceId: string;
    subscriptionId: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    seats: number;
    paymentMethod?: {
        brand: string | undefined;
        last4: string | undefined;
    };
};
