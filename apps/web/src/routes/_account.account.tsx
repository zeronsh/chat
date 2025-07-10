import { Anonymous } from '@/components/app/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { PaintbrushIcon, SettingsIcon, UserIcon } from 'lucide-react';

export const Route = createFileRoute('/_account/account')({
    component: RouteComponent,
});

const pages = [
    {
        title: 'Account',
        url: '/account',
        icon: <UserIcon />,
    },
    {
        title: 'Preferences',
        url: '/account/preferences',
        icon: <SettingsIcon />,
    },
    {
        title: 'Appearance',
        url: '/account/appearance',
        icon: <PaintbrushIcon />,
    },
];

function RouteComponent() {
    return (
        <div className="flex flex-1 py-24">
            <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account preferences and configuration.
                    </p>
                </div>
                <div className="overflow-x-auto min-w-full w-0">
                    <div className="flex flex-row gap-2">
                        {pages.map(page => (
                            <Button asChild key={page.url} variant="ghost">
                                <Link
                                    to={page.url}
                                    className="flex items-center justify-start gap-2"
                                    activeOptions={{
                                        exact: true,
                                    }}
                                    activeProps={{
                                        className: 'bg-muted/50 border border-foreground/10',
                                    }}
                                >
                                    {page.icon}
                                    {page.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex-1">
                    <Anonymous>
                        <Alert className="bg-background/10 border border-primary/20 backdrop-blur-md mb-8">
                            <AlertTitle>Not logged in</AlertTitle>
                            <AlertDescription>
                                You are currently an anonymous user. Your chats, messages and
                                preferences may be deleted in the future. To save your data, create
                                an account or login.
                                <Button variant="default" size="sm" className="mt-4" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </Anonymous>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
