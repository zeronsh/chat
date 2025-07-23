import { useDatabase } from '@/context/database';
import { useQuery } from '@rocicorp/zero/react';

export function useSubscription() {
    const db = useDatabase();
    const [subscription] = useQuery(
        db.query.subscription.related('organizationCustomer').related('userCustomer')
    );

    return subscription;
}
