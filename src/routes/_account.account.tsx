import { Anonymous } from '@/components/app/auth';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { BotIcon, CreditCardIcon, PaintbrushIcon, SettingsIcon, UserIcon } from 'lucide-react';

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
        title: 'Subscription',
        url: '/account/subscription',
        icon: <CreditCardIcon />,
    },
    {
        title: 'Preferences',
        url: '/account/preferences',
        icon: <SettingsIcon />,
    },
    {
        title: 'Models',
        url: '/account/models',
        icon: <BotIcon />,
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
                        <Section
                            title="Anonymous"
                            description="As an anonymous user, your data may be deleted or lost at any time. Login to keep your data safe."
                        >
                            <div className="border backdrop-blur-md mb-8 p-0 rounded-lg bg-card overflow-hidden text-sm text-muted-foreground flex flex-col">
                                <div className="p-4 flex flex-col gap-2">
                                    <h3>Not logged in</h3>
                                    <p>
                                        You are currently an anonymous user. Your chats, messages
                                        and preferences may be deleted in the future. To save your
                                        data, create an account or login.
                                    </p>
                                </div>
                                <div className="flex px-4 py-3 bg-sidebar w-full justify-end border-t">
                                    <Button variant="default" size="sm" asChild>
                                        <Link to="/login">Login</Link>
                                    </Button>
                                </div>
                            </div>
                        </Section>
                        <Separator className="mb-8" />
                    </Anonymous>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
