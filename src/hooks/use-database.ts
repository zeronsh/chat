import { DatabaseContext } from '@/context/database';
import { useContext } from 'react';
import { Route } from '@/routes/__root';
import { useQuery } from '@rocicorp/zero/react';
import { Thread } from '@/zero/types';
import { UserId } from '@/database/types';

export function useDatabase() {
    const database = useContext(DatabaseContext);

    if (!database) {
        throw new Error('useZero must be used within a ZeroProvider');
    }

    return database;
}

export function useSettings() {
    const db = useDatabase();
    const loaderData = Route.useLoaderData();
    const [settings] = useQuery(
        db.query.setting.where('userId', '=', db.userID).related('model').one()
    );

    return settings ?? loaderData.settings;
}

export function useThreads() {
    const db = useDatabase();
    const loaderData = Route.useLoaderData();
    const [threads] = useQuery(
        db.query.thread
            .related('messages', q => q.orderBy('createdAt', 'desc'))
            .orderBy('updatedAt', 'desc'),
        {
            ttl: Infinity,
        }
    );

    return threads.length > 0
        ? threads
        : (loaderData.threads?.map(thread => ({
              ...thread,
              createdAt: thread.createdAt.getTime(),
              updatedAt: thread.updatedAt.getTime(),
          })) as Thread[]) ?? [];
}

export function useCustomer() {
    const db = useDatabase();
    const loaderData = Route.useLoaderData();
    const [customer] = useQuery(
        db.query.userCustomer.where('userId', '=', UserId(db.userID)).one()
    );

    return customer ?? loaderData.customer;
}

export function useUsage() {
    const db = useDatabase();
    const loaderData = Route.useLoaderData();
    const [usage] = useQuery(db.query.usage.where('userId', '=', UserId(db.userID)).one());

    return usage ?? loaderData.usage;
}
