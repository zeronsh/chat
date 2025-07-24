import { Brand } from 'effect';

export type CustomerId = string & Brand.Brand<'CustomerId'>;
export const CustomerId = Brand.nominal<CustomerId>();

export type UserId = string & Brand.Brand<'UserId'>;
export const UserId = Brand.nominal<UserId>();

export type OrganizationId = string & Brand.Brand<'OrganizationId'>;
export const OrganizationId = Brand.nominal<OrganizationId>();

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
