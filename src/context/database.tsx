import { authClient } from '@/lib/auth-client';
import { env } from '@/lib/env';
import { cn } from '@/lib/utils';
import { Route } from '@/routes/__root';
import { schema, Schema } from '@/zero/schema';
import { Zero } from '@rocicorp/zero';
import { ZeroProvider } from '@rocicorp/zero/react';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { Scripts } from '@tanstack/react-router';

const DatabaseContext = createContext<Zero<Schema> | undefined>(undefined);

export function useDatabase() {
    const database = useContext(DatabaseContext);

    if (!database) {
        throw new Error('useZero must be used within a ZeroProvider');
    }

    return database;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const loaderData = Route.useLoaderData();

    const clientSession = authClient.useSession() ?? {
        data: loaderData.session,
        isPending: Boolean(loaderData.session),
    };

    const { session, isPending } = useMemo(() => {
        return {
            session: clientSession.data ?? loaderData.session,
            isPending: loaderData.session ? false : clientSession.isPending,
        };
    }, [clientSession, loaderData.session]);

    const zero = useMemo(() => {
        if (!session) {
            return undefined;
        }

        if (!session.user) {
            return undefined;
        }

        if (typeof window === 'undefined') {
            return new Zero({
                userID: session.user.id,
                auth: session.session.token,
                server: env.VITE_PUBLIC_ZERO_URL,
                schema,
                kvStore: 'mem',
            });
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

    if (isPending || !session || !zero) {
        return null;
    }

    return (
        <DatabaseContext.Provider value={zero}>
            <ZeroProvider zero={zero}>{children}</ZeroProvider>
        </DatabaseContext.Provider>
    );
}
