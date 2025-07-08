import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';

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
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap',
            },
        ],
    }),

    component: () => (
        <RootDocument>
            <RootComponent />
        </RootDocument>
    ),
});

function RootComponent() {
    return (
        <body>
            <div className="fixed inset-0 flex text-foreground">
                <Outlet />

                {/* <TanStackRouterDevtools /> */}
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
            {children}
        </html>
    );
}
