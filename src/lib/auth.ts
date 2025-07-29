import { db, schema } from '@/database';
import { UserId } from '@/database/types';
import { env } from '@/lib/env';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous, emailOTP, jwt, magicLink, organization } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    trustedOrigins: ['https://zeron.sh', 'https://www.zeron.sh', 'http://localhost:5173'],
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
    },
    databaseHooks: {
        user: {
            create: {
                after: async user => {
                    await db.transaction(async tx => {
                        await tx.insert(schema.setting).values({
                            id: nanoid(),
                            userId: UserId(user.id),
                            mode: 'dark',
                            theme: 'default',
                            modelId: 'kimi-k2',
                        });
                        await tx.insert(schema.usage).values({
                            id: nanoid(),
                            userId: UserId(user.id),
                            credits: 0,
                            search: 0,
                            research: 0,
                        });
                    });
                },
            },
        },
    },
    plugins: [
        organization(),
        jwt(),
        magicLink({
            sendMagicLink: async ({ email, token, url }) => {
                // Implement your magic link sending logic here
                console.log({
                    email,
                    token,
                    url,
                });
            },
        }),
        emailOTP({
            sendVerificationOTP: async ({ email, otp, type }) => {
                console.log({
                    email,
                    otp,
                    type,
                });
            },
        }),
        anonymous({
            onLinkAccount: async ({ anonymousUser, newUser }) => {
                await db
                    .update(schema.thread)
                    .set({ userId: UserId(newUser.user.id) })
                    .where(eq(schema.thread.userId, UserId(anonymousUser.user.id)));

                await db
                    .update(schema.message)
                    .set({ userId: UserId(newUser.user.id) })
                    .where(eq(schema.message.userId, UserId(anonymousUser.user.id)));
            },
        }),
    ],
});
