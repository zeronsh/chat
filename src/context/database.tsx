import { authClient } from '@/lib/auth-client';
import { env } from '@/lib/env';
import { useSession } from '@/hooks/use-session';
import { Route } from '@/routes/__root';
import { schema, Schema } from '@/zero/schema';
import { Zero } from '@rocicorp/zero';
import { ZeroProvider } from '@rocicorp/zero/react';
import { createContext, useEffect, useMemo } from 'react';

export const DatabaseContext = createContext<Zero<Schema> | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const loaderData = Route.useLoaderData();

    const clientSession = useSession();

    const { session, isPending } = useMemo(() => {
        return {
            session: clientSession.data ?? loaderData.session,
            isPending: !loaderData.session || clientSession.isPending,
        };
    }, [clientSession, loaderData.session]);

    const zero = useMemo(() => {
        if (typeof window === 'undefined' || !session || !session.user) {
            return undefined;
        }

        return new Zero({
            userID: session.user.id,
            server: env.VITE_PUBLIC_ZERO_URL,
            auth: async () => {
                if (session) {
                    const response = await fetch(`${env.VITE_PUBLIC_API_URL}/api/auth/token`, {
                        credentials: 'include',
                    });
                    const data = await response.json();
                    return data.token;
                }
            },
            schema,
            kvStore: 'idb',
        });
    }, [session]);

    useEffect(() => {
        if (!session && !isPending) {
            // If the user is not signed in, sign them in as an anonymous user
            authClient.signIn.anonymous();
        }
    }, [session, isPending]);

    useEffect(() => {
        if (zero) {
            zero.query.model.preload();
            zero.query.setting.where('userId', '=', zero.userID).preload();
            zero.query.thread
                .related('messages', q => q.orderBy('createdAt', 'asc'))
                .orderBy('updatedAt', 'desc')
                .preload();
        }
    }, [zero]);

    if (isPending || !session || !zero) {
        return null;
    }

    return (
        <DatabaseContext.Provider value={zero}>
            <ZeroProvider zero={zero}>{children}</ZeroProvider>
        </DatabaseContext.Provider>
    );
}
