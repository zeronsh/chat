import { db, schema } from '@/database';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous, jwt, magicLink, organization } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { stripe } from '@better-auth/stripe';
import { stripeClient } from '@/lib/stripe';
import { env } from '@/lib/env';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    databaseHooks: {
        user: {
            create: {
                after: async user => {
                    await db.insert(schema.setting).values({
                        id: nanoid(),
                        userId: user.id,
                        mode: 'dark',
                        theme: 'default',
                        modelId: 'gpt-4o-mini',
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
        anonymous({
            onLinkAccount: async ({ anonymousUser, newUser }) => {
                const existingSettings = await db
                    .select()
                    .from(schema.setting)
                    .where(eq(schema.setting.userId, newUser.user.id))
                    .limit(1);

                if (existingSettings.length === 0) {
                    await db
                        .update(schema.setting)
                        .set({ userId: newUser.user.id })
                        .where(eq(schema.setting.userId, anonymousUser.user.id));
                }

                await db
                    .update(schema.thread)
                    .set({ userId: newUser.user.id })
                    .where(eq(schema.thread.userId, anonymousUser.user.id));

                await db
                    .update(schema.message)
                    .set({ userId: newUser.user.id })
                    .where(eq(schema.message.userId, anonymousUser.user.id));
            },
        }),
    ],
});
