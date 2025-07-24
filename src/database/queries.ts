import { type db, schema } from '@/database';
import { ThreadMessage } from '@/ai/types';
import { and, eq, gt, not } from 'drizzle-orm';
import { CustomerId, OrganizationId, SubscriptionData, UserId } from '@/database/types';

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Database = typeof db | Transaction;

export async function getThreadById(db: Database, threadId: string) {
    return db.query.thread.findFirst({
        where: (thread, { eq }) => eq(thread.id, threadId),
    });
}

export async function getMessageById(db: Database, messageId: string) {
    return db.query.message.findFirst({
        where: (message, { eq }) => eq(message.id, messageId),
    });
}

export async function getModelById(db: Database, modelId: string) {
    return db.query.model.findFirst({
        where: (model, { eq }) => eq(model.id, modelId),
    });
}

export async function createThread(db: Database, args: { userId: string; threadId: string }) {
    return db
        .insert(schema.thread)
        .values({
            id: args.threadId,
            userId: args.userId,
            status: 'submitted',
        })
        .returning();
}

export async function createMessage(
    db: Database,
    args: {
        threadId: string;
        userId: string;
        message: ThreadMessage;
    }
) {
    return db
        .insert(schema.message)
        .values({
            id: args.message.id,
            threadId: args.threadId,
            userId: args.userId,
            message: args.message,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning();
}

export async function updateMessage(
    db: Database,
    args: {
        messageId: string;
        message: ThreadMessage;
        updatedAt?: Date;
    }
) {
    return db
        .update(schema.message)
        .set({
            message: args.message,
            updatedAt: args.updatedAt,
        })
        .where(eq(schema.message.id, args.messageId))
        .returning();
}

export async function deleteTrailingMessages(
    db: Database,
    args: {
        threadId: string;
        messageId: string;
        messageCreatedAt: Date;
    }
) {
    return db
        .delete(schema.message)
        .where(
            and(
                eq(schema.message.threadId, args.threadId),
                gt(schema.message.createdAt, args.messageCreatedAt),
                not(eq(schema.message.id, args.messageId))
            )
        );
}

export async function getThreadMessageHistory(db: Database, threadId: string) {
    const messages = await db.query.message.findMany({
        where: (message, { eq }) => eq(message.threadId, threadId),
        orderBy: (message, { asc }) => asc(message.createdAt),
    });

    return messages.map(message => message.message);
}

export async function updateThread(
    db: Database,
    args: {
        threadId: string;
        status: 'ready' | 'streaming' | 'submitted';
        streamId?: string | null;
        updatedAt?: Date;
    }
) {
    return db
        .update(schema.thread)
        .set({ status: args.status, streamId: args.streamId, updatedAt: args.updatedAt })
        .where(eq(schema.thread.id, args.threadId));
}

export async function updateThreadTitle(db: Database, args: { threadId: string; title: string }) {
    return db
        .update(schema.thread)
        .set({ title: args.title, updatedAt: new Date() })
        .where(eq(schema.thread.id, args.threadId));
}

export async function getThreadByStreamId(db: Database, streamId: string) {
    const thread = await db.query.thread.findFirst({
        where: (thread, { eq }) => eq(thread.streamId, streamId),
    });

    return thread;
}

export async function getSettingsByUserId(db: Database, userId: string) {
    return db.query.setting.findFirst({
        where: (setting, { eq }) => eq(setting.userId, userId),
    });
}

export async function getUserCustomerByUserId(db: Database, userId: UserId) {
    return db.query.userCustomer.findFirst({
        where: (userCustomer, { eq }) => eq(userCustomer.userId, userId),
    });
}

export async function createUserCustomer(
    db: Database,
    args: { userId: UserId; customerId: CustomerId }
) {
    return db
        .insert(schema.userCustomer)
        .values({
            id: args.customerId,
            userId: args.userId,
        })
        .returning();
}

export async function updateUserCustomerSubscription(
    db: Database,
    args: { customerId: CustomerId; subscription: SubscriptionData }
) {
    return db
        .update(schema.userCustomer)
        .set({ subscription: args.subscription })
        .where(eq(schema.userCustomer.id, args.customerId));
}

export async function getOrganizationCustomerByOrganizationId(
    db: Database,
    organizationId: OrganizationId
) {
    return db.query.organizationCustomer.findFirst({
        where: (organizationCustomer, { eq }) =>
            eq(organizationCustomer.organizationId, organizationId),
    });
}

export async function createOrganizationCustomer(
    db: Database,
    args: { organizationId: OrganizationId; customerId: CustomerId }
) {
    return db
        .insert(schema.organizationCustomer)
        .values({
            id: args.customerId,
            organizationId: args.organizationId,
        })
        .returning();
}

export async function updateOrganizationCustomerSubscription(
    db: Database,
    args: { customerId: CustomerId; subscription: SubscriptionData }
) {
    return db
        .update(schema.organizationCustomer)
        .set({ subscription: args.subscription })
        .where(eq(schema.organizationCustomer.id, args.customerId));
}
