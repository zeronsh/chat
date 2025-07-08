import { authClient } from '@/lib/auth-client';
import { env } from '@/lib/env';
import { schema, Schema } from '@/zero/schema';
import { Zero } from '@rocicorp/zero';
import { ZeroProvider } from '@rocicorp/zero/react';
import { createContext, useContext, useEffect, useMemo } from 'react';

const DatabaseContext = createContext<Zero<Schema> | undefined>(undefined);

export function useDatabase() {
    const database = useContext(DatabaseContext);

    if (!database) {
        throw new Error('useZero must be used within a ZeroProvider');
    }

    return database;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    const zero = useMemo(() => {
        if (!session) {
            return undefined;
        }

        if (!session.user) {
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
            kvStore: 'mem',
        });
    }, [session]);

    useEffect(() => {
        if (!session && !isPending) {
            // If the user is not signed in, sign them in as an anonymous user
            authClient.signIn.anonymous();
        }
    }, [session, isPending]);

    if (isPending || !session || !zero) {
        return (
            <body className="fixed inset-0 bg-background dark">
                <div className="moon animate-pulse duration-[3000ms]" />
            </body>
        );
    }

    return (
        <DatabaseContext.Provider value={zero}>
            <ZeroProvider zero={zero}>{children}</ZeroProvider>
        </DatabaseContext.Provider>
    );
}
