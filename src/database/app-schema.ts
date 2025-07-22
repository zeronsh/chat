import { relations } from 'drizzle-orm';
import { index, jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { Capability, ThreadMessage } from '@/ai/types';
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

export const thread = pgTable(
    'thread',
    {
        id: text('id').primaryKey(),
        title: text('title'),
        status: statusEnum('status').notNull().default('ready'),
        streamId: text('stream_id'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
    },
    table => [index('stream_id_index').on(table.streamId)]
);

export const modelAccessEnum = pgEnum('access', ['public', 'account_required', 'premium_required']);

export const modelIconEnum = pgEnum('icon', [
    'anthropic',
    'claude',
    'deepseek',
    'gemini',
    'google',
    'grok',
    'meta',
    'mistral',
    'ollama',
    'openai',
    'openrouter',
    'x',
    'xai',
]);

export const model = pgTable('model', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    model: text('model').notNull(),
    description: text('description').notNull(),
    capabilities: jsonb('capabilities').$type<Capability[]>().notNull().default([]),
    icon: modelIconEnum('icon').notNull(),
    access: modelAccessEnum('access').notNull().default('public'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const modeEnum = pgEnum('mode', ['light', 'dark']);

export const setting = pgTable('setting', {
    id: text('id').primaryKey(),
    mode: modeEnum('mode').notNull().default('dark'),
    theme: text('theme'),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    nickname: text('nickname'),
    biography: text('biography'),
    instructions: text('instructions'),
    modelId: text('model_id').notNull().default('gpt-4o-mini'),
});

export const threadRelations = relations(thread, ({ many, one }) => ({
    user: one(user, {
        fields: [thread.userId],
        references: [user.id],
    }),
    messages: many(message),
}));

export const userRelations = relations(user, ({ many, one }) => ({
    threads: many(thread),
    messages: many(message),
    settings: one(setting, {
        fields: [user.id],
        references: [setting.userId],
    }),
}));

export const settingRelations = relations(setting, ({ one }) => ({
    user: one(user, {
        fields: [setting.userId],
        references: [user.id],
    }),
    model: one(model, {
        fields: [setting.modelId],
        references: [model.id],
    }),
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
