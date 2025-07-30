import { schema } from '@/database/schema';
import { env } from '@/lib/env';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(env.ZERO_UPSTREAM_DB, { schema });

export { schema };

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Database = typeof db | Transaction;
