import { StrictMode } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import { routeTree } from '@zeronsh/router';

const router = createRouter({ routeTree });

const elem = document.getElementById('root')!;

const app = (
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

if (import.meta.hot) {
    // With hot module reloading, `import.meta.hot.data` is persisted.
    const root = (import.meta.hot.data.root ??= createRoot(elem));
    root.render(app);
} else {
    // The hot module reloading API is not available in production.
    createRoot(elem).render(app);
}
