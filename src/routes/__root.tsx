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
import { SubscriptionData, UserId } from '@/database/types';
import { z } from 'zod';

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
                    Effect.bind('context', ({ session }) =>
                        queries.getSSRData(UserId(session.user.id))
                    ),
                    Effect.bind('thread', ({ session }) => {
                        if (data.threadId) {
                            return queries.getThreadByIdAndUserId(
                                data.threadId,
                                UserId(session.user.id)
                            );
                        }
                        return Effect.succeed(undefined);
                    }),
                    Effect.bind('end', () => Clock.currentTimeMillis),
                    Effect.tap(({ now, end }) => Effect.log(`SSR Duration: ${end - now}ms`)),
                    Effect.provide(DatabaseLive),
                    Effect.provide(SessionLive(request)),
                    Effect.map(({ context, session, thread }) => ({
                        session,
                        settings: context.settings,
                        threads: context.threads,
                        customer: context.customer as
                            | {
                                  id: string;
                                  userId: string;
                                  subscription: SubscriptionData | null;
                              }
                            | undefined,
                        usage: context.usage as
                            | {
                                  search: number;
                                  id: string;
                                  userId: string;
                                  credits: number;
                                  research: number;
                              }
                            | undefined,
                        user: context.user,
                        thread: thread,
                    }))
                );
            }),
            Effect.catchAll(_ => Effect.succeed(undefined))
        );

        return Effect.runPromise(program);
    });

export const Route = createRootRoute({
    head: (ctx: any) => ({
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
                href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap',
            },
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
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
    notFoundComponent: () => <div>Not found</div>,
    component: () => <RootDocument />,
});

function RootComponent({ bodyRef }: { bodyRef: React.RefObject<HTMLBodyElement | null> }) {
    const settings = useSettings();

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.className = cn(
                'fixed inset-0',
                settings?.mode ?? 'dark',
                settings?.theme ?? 'default'
            );
        }
    }, [settings?.mode, settings?.theme]);

    return (
        <div className="fixed inset-0 flex text-foreground">
            <Outlet />
            <Toaster position="top-center" />
        </div>
    );
}

function RootDocument() {
    const ref = useRef<HTMLBodyElement>(null);
    const loaderData = Route.useLoaderData();

    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body
                ref={ref}
                className={cn(
                    'fixed inset-0',
                    loaderData?.settings?.mode ?? 'dark',
                    loaderData?.settings?.theme ?? 'default'
                )}
            >
                <DatabaseProvider>
                    <RootComponent bodyRef={ref} />
                </DatabaseProvider>
                <Scripts />
            </body>
        </html>
    );
}
