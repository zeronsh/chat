import { schema } from '@/database/schema';
import { env } from '@/lib/env';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(env.ZERO_UPSTREAM_DB, { schema });

export { schema };
