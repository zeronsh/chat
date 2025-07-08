import { relations } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { ThreadMessage } from '@/components/chat/types';
import { user } from '@/database/auth-schema';

export const message = pgTable('message', {
    id: text('id').primaryKey(),
    message: jsonb('message').$type<ThreadMessage>().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    threadId: text('thread_id')
        .notNull()
        .references(() => thread.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
});

export const statusEnum = pgEnum('status', ['ready', 'streaming', 'submitted']);

export const thread = pgTable('thread', {
    id: text('id').primaryKey(),
    title: text('title'),
    status: statusEnum('status').notNull().default('ready'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
});

export const threadRelations = relations(thread, ({ many, one }) => ({
    user: one(user, {
        fields: [thread.userId],
        references: [user.id],
    }),
    messages: many(message),
}));

export const userRelations = relations(user, ({ many }) => ({
    threads: many(thread),
    messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
    thread: one(thread, {
        fields: [message.threadId],
        references: [thread.id],
    }),
    user: one(user, {
        fields: [message.userId],
        references: [user.id],
    }),
}));
