import { createServerFileRoute } from '@tanstack/react-start/server';
import { createUploadthing, UploadThingError, createRouteHandler } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';

export const ServerRoute = createServerFileRoute('/api/uploadthing').methods({
    GET: ({ request }) => {
        return handlers(request);
    },
    POST: ({ request }) => {
        return handlers(request);
    },
});

const f = createUploadthing();

const router = {
    fileUploader: f({
        image: {
            maxFileSize: '2MB',
            maxFileCount: 5,
        },
        pdf: {
            maxFileSize: '8MB',
            maxFileCount: 5,
        },
    }).onUploadComplete(({ metadata, file }) => {
        return {};
    }),
} satisfies FileRouter;

const handlers = createRouteHandler({ router });

export type UploadRouter = typeof router;
