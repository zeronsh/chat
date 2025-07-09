import { schema } from '@/database/schema';
import { drizzleZeroConfig } from 'drizzle-zero';

export default drizzleZeroConfig(schema, {
    tables: {
        message: {
            id: true,
            message: true,
            threadId: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
        thread: {
            id: true,
            title: true,
            userId: true,
            streamId: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        user: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            isAnonymous: true,
        },
        session: {
            id: true,
            expiresAt: true,
            token: true,
            createdAt: true,
            updatedAt: true,
            ipAddress: true,
            userAgent: true,
            userId: true,
        },
        account: false,
        verification: false,
        jwks: false,
    },
});
