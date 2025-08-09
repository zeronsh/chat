// @ts-ignore
import appCss from '@/global.css?url';

import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { DatabaseProvider } from '@/context/database';
import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

import { createServerFn } from '@tanstack/react-start';
import { Session, SessionLive } from '@/lib/auth';
import { getWebRequest } from '@tanstack/react-start/server';
import { Effect } from 'effect';
import * as queries from '@/database/queries';
import { DatabaseLive } from '@/database/effect';

const getSettings = createServerFn({ method: 'GET' }).handler(async () => {
    const program = Effect.Do.pipe(
        Effect.let('request', () => getWebRequest()),
        Effect.flatMap(({ request }) => {
            return Effect.Do.pipe(
                Effect.bind('session', () => Session),
                Effect.bind('settings', ({ session }) =>
                    queries.getSettingsByUserId(session.user.id)
                ),
                Effect.provide(DatabaseLive),
                Effect.provide(SessionLive(request)),
                Effect.map(({ settings }) => settings)
            );
        }),
        Effect.catchAll(_ => Effect.succeed(undefined))
    );

    return Effect.runPromise(program);
});

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Zeron',
            },
        ],
        links: [
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com',
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossOrigin: 'anonymous',
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap',
            },
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    shouldReload: false,
    loader: async () => {
        const settings = await getSettings();
        return {
            settings,
        };
    },
    notFoundComponent: () => <div>Not found</div>,
    component: () => (
        <RootDocument>
            <RootComponent />
        </RootDocument>
    ),
});

function RootComponent() {
    const context = Route.useLoaderData();
    const settings = useSettings() ?? context.settings;

    return (
        <body
            className={cn('fixed inset-0', settings?.mode ?? 'dark', settings?.theme ?? 'default')}
        >
            <div className="fixed inset-0 flex text-foreground">
                <Outlet />
                <Toaster position="top-center" />
            </div>
        </body>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
                <Scripts />
            </head>
            <DatabaseProvider>{children}</DatabaseProvider>
        </html>
    );
}
