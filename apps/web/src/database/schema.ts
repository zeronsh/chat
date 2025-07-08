import * as threadSchema from '@/database/thread-schema';
import * as authSchema from '@/database/auth-schema';

export const schema = {
    ...authSchema,
    ...threadSchema,
};

export * from '@/database/auth-schema';
export * from '@/database/thread-schema';
