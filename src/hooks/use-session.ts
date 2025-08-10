import { authClient } from '@/lib/auth-client';
import { Route } from '@/routes/__root';
import { Session, User } from 'better-auth';
import { useEffect, useMemo, useState } from 'react';

export function useSession() {
    const loaderData = Route.useLoaderData();
    const [session] = useState<
        | {
              session: Session;
              user: User & {
                  isAnonymous: boolean;
              };
          }
        | undefined
    >(loaderData.session as any);
    const [isPending, setIsPending] = useState(true);
    const sessionQuery = authClient.useSession();

    const state = useMemo(
        () => ({
            ...sessionQuery,
            data: sessionQuery.data ?? session,
            isPending,
        }),
        [sessionQuery, session]
    );

    useEffect(() => {
        if (session || sessionQuery.data) {
            setIsPending(false);
        }
    }, [session, sessionQuery.data]);

    return state;
}
