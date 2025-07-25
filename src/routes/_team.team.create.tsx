import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_team/team/create')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-1 py-24">
            <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold">Create Team</h1>
                    <p className="text-muted-foreground">
                        Create a new team to collaborate with your team members.
                    </p>
                </div>
            </div>
        </div>
    );
}
