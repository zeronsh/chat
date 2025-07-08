import { createFileRoute } from '@tanstack/react-router';
import { Base } from '@/components/chat/base';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return <Base />;
}
