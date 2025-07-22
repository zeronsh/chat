import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_thread/')({
    component: Index,
});

function Index() {
    return null;
}
