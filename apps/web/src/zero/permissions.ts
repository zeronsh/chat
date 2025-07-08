import { type Schema, schema } from '@/zero/schema';
import type { AuthData, TableName } from '@/zero/types';
import { definePermissions, ExpressionBuilder, PermissionsConfig } from '@rocicorp/zero';

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
    const allowIfUser = (authData: AuthData, builder: ExpressionBuilder<Schema, TableName>) =>
        builder.and(allowIfSignedIn(authData, builder), builder.cmp('id', '=', authData.sub));

    const allowIfSignedIn = (authData: AuthData, builder: ExpressionBuilder<Schema, TableName>) =>
        builder.cmpLit(authData.sub, 'IS NOT', null);

    const canReadMessage = (authData: AuthData, builder: ExpressionBuilder<Schema, 'message'>) =>
        builder.exists('thread', thread =>
            thread.where(builder => builder.cmp('userId', '=', authData.sub))
        );

    const allowIfThreadCreator = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'thread'>
    ) => builder.and(allowIfSignedIn(authData, builder), builder.cmp('userId', '=', authData.sub));

    const allowIfMessageCreator = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'message'>
    ) => builder.and(allowIfSignedIn(authData, builder), builder.cmp('userId', '=', authData.sub));

    return {
        user: {
            row: {
                select: [allowIfUser],
            },
        },
        message: {
            row: {
                select: [canReadMessage],
                insert: [allowIfMessageCreator],
                delete: [allowIfMessageCreator],
                update: {
                    preMutation: [allowIfMessageCreator],
                    postMutation: [allowIfMessageCreator],
                },
            },
        },
        thread: {
            row: {
                select: [allowIfThreadCreator],
                insert: [allowIfThreadCreator],
                delete: [allowIfThreadCreator],
                update: {
                    preMutation: [allowIfThreadCreator],
                    postMutation: [allowIfThreadCreator],
                },
            },
        },
    } satisfies PermissionsConfig<AuthData, Schema>;
});
