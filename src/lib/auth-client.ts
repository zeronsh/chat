import { env } from '@/lib/env';
import {
    anonymousClient,
    emailOTPClient,
    magicLinkClient,
    organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    baseURL: env.VITE_PUBLIC_API_URL,
    plugins: [magicLinkClient(), anonymousClient(), organizationClient(), emailOTPClient()],
});
