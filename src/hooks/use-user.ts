import { useDatabase } from '@/hooks/use-database';
import { useQuery } from '@rocicorp/zero/react';

export function useUser() {
    const db = useDatabase();
    const [user] = useQuery(db.query.user.where('id', '=', db.userID).one());
    return user;
}
