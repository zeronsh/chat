import { ThreadMessage } from '@/ai/types';
import { Database } from '@/database/effect';
import { schema } from '@/database/schema';
import { CustomerId, OrganizationId, SubscriptionData, UserId } from '@/database/types';
import { Effect } from 'effect';
import { and, eq, gt, not, sql } from 'drizzle-orm';

export function getThreadById(threadId: string) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.thread.findFirst({
                where: (thread, { eq }) => eq(thread.id, threadId),
            })
        );
    });
}

export function getMessageById(messageId: string) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.message.findFirst({
                where: (message, { eq }) => eq(message.id, messageId),
            })
        );
    });
}

export function getUserById(userId: string) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.user.findFirst({
                where: (user, { eq }) => eq(user.id, userId),
            })
        );
    });
}

export function getModelById(modelId: string) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.model.findFirst({
                where: (model, { eq }) => eq(model.id, modelId),
            })
        );
    });
}

export function createThread(values: { id: string; userId: string }) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .insert(schema.thread)
                .values({
                    id: values.id,
                    userId: values.userId,
                    status: 'submitted',
                })
                .returning()
        );
    });
}

export function createMessage(values: {
    threadId: string;
    userId: string;
    message: ThreadMessage;
}) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .insert(schema.message)
                .values({
                    id: values.message.id,
                    threadId: values.threadId,
                    userId: values.userId,
                    message: values.message,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning()
        );
    });
}

export function updateMessage(values: {
    messageId: string;
    message: ThreadMessage;
    updatedAt?: Date;
}) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .update(schema.message)
                .set({
                    message: values.message,
                    updatedAt: values.updatedAt,
                })
                .where(eq(schema.message.id, values.messageId))
                .returning()
        );
    });
}

export function deleteTrailingMessages(values: {
    threadId: string;
    messageId: string;
    messageCreatedAt: Date;
}) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .delete(schema.message)
                .where(
                    and(
                        eq(schema.message.threadId, values.threadId),
                        gt(schema.message.createdAt, values.messageCreatedAt),
                        not(eq(schema.message.id, values.messageId))
                    )
                )
        );
    });
}

export function getThreadMessageHistory(threadId: string) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        const messages = yield* Effect.tryPromise(() =>
            db.query.message.findMany({
                where: (message, { eq }) => eq(message.threadId, threadId),
                orderBy: (message, { asc }) => asc(message.createdAt),
            })
        );
        return messages.map(message => message.message);
    });
}

export function updateThread(values: {
    threadId: string;
    status: 'ready' | 'streaming' | 'submitted';
    streamId?: string | null;
    updatedAt?: Date;
}) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .update(schema.thread)
                .set({
                    status: values.status,
                    streamId: values.streamId,
                    updatedAt: values.updatedAt,
                })
                .where(eq(schema.thread.id, values.threadId))
        );
    });
}

export function updateThreadTitle(values: { threadId: string; title: string }) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .update(schema.thread)
                .set({ title: values.title, updatedAt: new Date() })
                .where(eq(schema.thread.id, values.threadId))
        );
    });
}

export function getThreadByStreamId(streamId: string) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.thread.findFirst({
                where: (thread, { eq }) => eq(thread.streamId, streamId),
            })
        );
    });
}

export function getSettingsByUserId(userId: string) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.setting.findFirst({
                where: (setting, { eq }) => eq(setting.userId, userId),
            })
        );
    });
}

export function getUserCustomerByUserId(userId: UserId) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.userCustomer.findFirst({
                where: (userCustomer, { eq }) => eq(userCustomer.userId, userId),
            })
        );
    });
}

export function createUserCustomer(values: { userId: UserId; customerId: CustomerId }) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .insert(schema.userCustomer)
                .values({
                    id: values.customerId,
                    userId: values.userId,
                })
                .returning()
        );
    });
}

export function updateUserCustomerSubscription(values: {
    customerId: CustomerId;
    subscription: SubscriptionData;
}) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .update(schema.userCustomer)
                .set({ subscription: values.subscription })
                .where(eq(schema.userCustomer.id, values.customerId))
        );
    });
}

export function getOrganizationCustomerByOrganizationId(organizationId: OrganizationId) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.organizationCustomer.findFirst({
                where: (organizationCustomer, { eq }) =>
                    eq(organizationCustomer.organizationId, organizationId),
            })
        );
    });
}

export function createOrganizationCustomer(values: {
    organizationId: OrganizationId;
    customerId: CustomerId;
}) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .insert(schema.organizationCustomer)
                .values({
                    id: values.customerId,
                    organizationId: values.organizationId,
                })
                .returning()
        );
    });
}

export function updateOrganizationCustomerSubscription(values: {
    customerId: CustomerId;
    subscription: SubscriptionData;
}) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .update(schema.organizationCustomer)
                .set({ subscription: values.subscription })
                .where(eq(schema.organizationCustomer.id, values.customerId))
        );
    });
}

export function getUsageByUserId(userId: UserId) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db.query.usage.findFirst({
                where: (usage, { eq }) => eq(usage.userId, userId),
            })
        );
    });
}

export function incrementUsage(
    values: { userId: UserId; type: 'search' | 'research' | 'credits' },
    amount: number
) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .update(schema.usage)
                .set({
                    [values.type]: sql`${schema.usage[values.type]} + ${amount}`,
                })
                .where(eq(schema.usage.userId, values.userId))
        );
    });
}

export function decrementUsage(
    values: { userId: UserId; type: 'search' | 'research' | 'credits' },
    amount: number
) {
    return Effect.gen(function* () {
        const db = yield* Database.instance;
        return yield* Effect.tryPromise(() =>
            db
                .update(schema.usage)
                .set({
                    [values.type]: sql`${schema.usage[values.type]} - ${amount}`,
                })
                .where(eq(schema.usage.userId, values.userId))
        );
    });
}
