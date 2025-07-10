import * as appSchema from '@/database/app-schema';
import * as authSchema from '@/database/auth-schema';

export const schema = {
    ...authSchema,
    ...appSchema,
};

export * from '@/database/auth-schema';
export * from '@/database/app-schema';
