import { authClient } from '@/lib/auth-client';

export function useSession() {
    return authClient.useSession();
}
