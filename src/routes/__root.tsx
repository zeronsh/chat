// @ts-ignore
import appCss from '@/global.css?url';
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { DatabaseProvider } from '@/context/database';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { createServerFn } from '@tanstack/react-start';
import { Session, SessionLive } from '@/lib/auth';
import { getWebRequest } from '@tanstack/react-start/server';
import { Clock, Effect } from 'effect';
import * as queries from '@/database/queries';
import { DatabaseLive } from '@/database/effect';
import { useEffect, useRef } from 'react';
import { useSettings } from '@/hooks/use-database';
import { z } from 'zod';
import { ProDialog } from '@/components/app/pro-dialog';

const GetContextSchema = z.object({
    threadId: z.string().optional(),
});

const getContext = createServerFn({ method: 'GET' })
    .validator((obj: unknown) => {
        return GetContextSchema.parse(obj);
    })
    .handler(async ({ data }) => {
        const program = Effect.Do.pipe(
            Effect.let('request', () => getWebRequest()),
            Effect.flatMap(({ request }) => {
                return Effect.Do.pipe(
                    Effect.bind('now', () => Clock.currentTimeMillis),
                    Effect.bind('session', () => Session),
                    Effect.bind('context', ({ session }) => queries.getSSRData(session.user.id)),
                    Effect.bind('thread', ({ session }) => {
                        if (data.threadId) {
                            return queries.getThreadByIdAndUserId(data.threadId, session.user.id);
                        }
                        return Effect.succeed(null);
                    }),
                    Effect.bind('end', () => Clock.currentTimeMillis),
                    Effect.tap(({ now, end }) => Effect.log(`SSR Duration: ${end - now}ms`)),
                    Effect.provide(SessionLive(request))
                );
            }),
            Effect.map(({ context, session, thread }) => ({
                session,
                thread,
                settings: context.results[0],
                customer: context.results[1],
                usage: context.results[2],
                user: context.results[3],
                threads: context.results[4],
            })),
            Effect.provide(DatabaseLive),
            Effect.catchAll(_ => Effect.succeed(undefined))
        );

        return Effect.runPromise(program);
    });

export const Route = createRootRoute({
    shouldReload: false,
    loader: async ({ params }) => {
        const context = await getContext({
            data: params,
        });

        return {
            settings: context?.settings,
            session: context?.session,
            threads: context?.threads,
            customer: context?.customer,
            usage: context?.usage,
            user: context?.user,
            thread: context?.thread,
        };
    },
    head: ctx => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: ctx?.loaderData?.thread?.title ?? 'Zeron',
            },
            {
                name: 'description',
                content: 'Chat with models from OpenAI, Anthropic, and more.',
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
                href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;500;600;700&display=swap',
            },
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    notFoundComponent: () => <div>Not found</div>,
    component: () => <RootDocument />,
});

function RootComponent({ htmlRef }: { htmlRef: React.RefObject<HTMLHtmlElement | null> }) {
    const settings = useSettings();

    useEffect(() => {
        if (htmlRef.current) {
            htmlRef.current.className = cn(settings?.mode ?? 'dark', settings?.theme ?? 'default');
        }
    }, [settings?.mode, settings?.theme]);

    return (
        <div className="fixed inset-0 flex text-foreground">
            <Outlet />
            <Toaster position="top-center" />
            <ProDialog />
        </div>
    );
}

function RootDocument() {
    const ref = useRef<HTMLHtmlElement>(null);
    const loaderData = Route.useLoaderData();

    return (
        <html
            lang="en"
            ref={ref}
            className={cn(
                loaderData?.settings?.mode ?? 'dark',
                loaderData?.settings?.theme ?? 'default'
            )}
        >
            <head>
                <HeadContent />
            </head>
            <body className="fixed inset-0">
                <DatabaseProvider>
                    <RootComponent htmlRef={ref} />
                </DatabaseProvider>
                <Scripts />
            </body>
        </html>
    );
}
