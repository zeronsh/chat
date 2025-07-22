import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_thread/$threadId')({
    component: RouteComponent,
});

function RouteComponent() {
    return null;
}
