import { createRouter as createTanstackRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';

export const createRouter = () => {
    const router = createTanstackRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreloadStaleTime: Infinity,
    });

    return router;
};

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}
