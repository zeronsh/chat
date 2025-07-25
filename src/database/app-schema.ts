import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { Capability, ThreadMessage } from '@/ai/types';
import { member, organization, user } from '@/database/auth-schema';
import { CustomerId, OrganizationId, SubscriptionData, UserId } from '@/database/types';

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

export const usage = pgTable('usage', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' })
        .$type<UserId>(),
    credits: integer('credits').notNull().default(0),
    search: integer('search').notNull().default(0),
    research: integer('research').notNull().default(0),
});

export const userCustomer = pgTable('user_customer', {
    id: text('id').primaryKey().unique().$type<CustomerId>(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' })
        .unique()
        .$type<UserId>(),
    subscription: jsonb('subscription').$type<SubscriptionData>(),
});

export const organizationCustomer = pgTable('organization_customer', {
    id: text('id').primaryKey().unique().$type<CustomerId>(),
    organizationId: text('organization_id')
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' })
        .unique()
        .$type<OrganizationId>(),
    subscription: jsonb('subscription').$type<SubscriptionData>(),
});

export const userCustomerRelations = relations(userCustomer, ({ one }) => ({
    user: one(user, {
        fields: [userCustomer.userId],
        references: [user.id],
    }),
}));

export const organizationCustomerRelations = relations(organizationCustomer, ({ one }) => ({
    organization: one(organization, {
        fields: [organizationCustomer.organizationId],
        references: [organization.id],
    }),
}));

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
    customer: one(userCustomer, {
        fields: [user.id],
        references: [userCustomer.userId],
    }),
}));

export const memberRelations = relations(member, ({ one }) => ({
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id],
    }),
}));

export const organizationRelations = relations(organization, ({ one, many }) => ({
    customer: one(organizationCustomer, {
        fields: [organization.id],
        references: [organizationCustomer.organizationId],
    }),
    members: many(member),
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
