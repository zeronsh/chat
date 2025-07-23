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
            builder.exists('members', members =>
                members.where(builder => builder.cmp('userId', '=', authData.sub))
            )
        );

    const allowSelectMembersIfInOrganization = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'member'>
    ) =>
        builder.and(
            allowIfSignedIn(authData, builder),
            builder.exists('organization', organization =>
                organization.whereExists('members', members =>
                    members.where(builder => builder.cmp('userId', '=', authData.sub))
                )
            )
        );

    const allowSelectSubscription = (
        authData: AuthData,
        builder: ExpressionBuilder<Schema, 'subscription'>
    ) =>
        builder.and(
            allowIfSignedIn(authData, builder),
            builder.or(
                builder.exists('userCustomer', userCustomer =>
                    userCustomer.where(builder => builder.cmp('userId', '=', authData.sub))
                ),
                builder.exists('organizationCustomer', organizationCustomer =>
                    organizationCustomer.whereExists('organization', organization =>
                        organization.whereExists('members', members =>
                            members.where(builder => builder.cmp('userId', '=', authData.sub))
                        )
                    )
                )
            )
        );

    return {
        user: {
            row: {
                select: [allowIfUser],
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
        subscription: {
            row: {
                select: [allowSelectSubscription],
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
