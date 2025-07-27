import type { UserId } from '@/database/types';
import { type Schema, schema } from '@/zero/schema';
import type { AuthData, TableName } from '@/zero/types';
import { definePermissions, ExpressionBuilder, PermissionsConfig } from '@rocicorp/zero';

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
    const allowIfUser = (authData: AuthData, builder: ExpressionBuilder<Schema, TableName>) =>
        builder.and(allowIfSignedIn(authData, builder), builder.cmp('id', '=', authData.sub));

    const allowIfOwnSession = (authData: AuthData, builder: ExpressionBuilder<Schema, 'session'>) =>
        builder.and(allowIfSignedIn(authData, builder), builder.cmp('userId', '=', authData.sub));

    const allowIfOwnSetting = (authData: AuthData, builder: ExpressionBuilder<Schema, 'setting'>) =>
        builder.and(allowIfSignedIn(authData, builder), builder.cmp('userId', '=', authData.sub));

    const allowIfOwnUsage = (authData: AuthData, builder: ExpressionBuilder<Schema, 'usage'>) =>
        builder.and(
            allowIfSignedIn(authData, builder),
            builder.cmp('userId', '=', authData.sub as UserId)
        );

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

    const allowIfInOrganization = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'organization'>
    ) =>
        builder.and(
            allowIfSignedIn(authData, builder),
            builder.exists('members', members => members.where('userId', '=', authData.sub))
        );

    const allowSelectMembersIfInOrganization = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'member'>
    ) =>
        builder.and(
            allowIfSignedIn(authData, builder),
            builder.exists('organization', organization =>
                organization.whereExists('members', members =>
                    members.where('userId', '=', authData.sub)
                )
            )
        );

    const allowReadIfCustomerBelongsToUser = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'userCustomer'>
    ) =>
        builder.and(
            allowIfSignedIn(authData, builder),
            builder.cmp('userId', '=', authData.sub as UserId)
        );

    const allowReadIfCustomerBelongsToOrganization = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'organizationCustomer'>
    ) =>
        builder.and(
            allowIfSignedIn(authData, builder),
            builder.exists('organization', organization =>
                organization.whereExists('members', members =>
                    members.where('userId', '=', authData.sub)
                )
            )
        );

    return {
        user: {
            row: {
                select: [allowIfUser],
            },
        },
        userCustomer: {
            row: {
                select: [allowReadIfCustomerBelongsToUser],
            },
        },
        organizationCustomer: {
            row: {
                select: [allowReadIfCustomerBelongsToOrganization],
            },
        },
        organization: {
            row: {
                select: [allowIfInOrganization],
            },
        },
        member: {
            row: {
                select: [allowSelectMembersIfInOrganization],
            },
        },
        usage: {
            row: {
                select: [allowIfOwnUsage],
            },
        },
        setting: {
            row: {
                select: [allowIfOwnSetting],
                insert: [allowIfOwnSetting],
                update: {
                    preMutation: [allowIfOwnSetting],
                    postMutation: [allowIfOwnSetting],
                },
            },
        },
        model: {
            row: {
                select: [allowIfSignedIn],
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
        session: {
            row: {
                select: [allowIfOwnSession],
                delete: [allowIfOwnSession],
            },
        },
    } satisfies PermissionsConfig<AuthData, Schema>;
});
