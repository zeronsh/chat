import { type Schema } from '@/zero/schema';
import { Row } from '@rocicorp/zero';

export type User = Row<Schema['tables']['user']>;
export type Thread = Row<Schema['tables']['thread']>;
export type Message = Row<Schema['tables']['message']>;
export type Session = Row<Schema['tables']['session']>;
export type Organization = Row<Schema['tables']['organization']>;
export type Member = Row<Schema['tables']['member']>;
export type Subscription = Row<Schema['tables']['subscription']>;
export type OrganizationCustomer = Row<Schema['tables']['organizationCustomer']>;
export type UserCustomer = Row<Schema['tables']['userCustomer']>;

export type TableName = keyof Schema['tables'];

export type AuthData = {
    sub: string;
};
