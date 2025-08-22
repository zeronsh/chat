import { env } from '@/lib/env';
import { schema } from '@/zero/schema';
import { Zero } from '@rocicorp/zero';

export let zero = createZero({ userID: 'anon' });

function createZero({ userID }: { userID: string }) {
    if (typeof window === 'undefined') return null;
    return new Zero({
        userID,
        server: env.VITE_PUBLIC_ZERO_URL,
        auth: async () => {
            if (userID !== 'anon') {
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
}

export function setZero({ userID }: { userID: string }) {
    zero = createZero({ userID });
}
