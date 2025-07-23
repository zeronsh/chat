import { useDatabase } from '@/context/database';
import { CustomerId } from '@/database/types';
import { useQuery } from '@rocicorp/zero/react';

export function useSettings() {
    const db = useDatabase();
    const [settings] = useQuery(
        db.query.setting.where('userId', '=', db.userID).related('model').one()
    );

    return settings;
}
