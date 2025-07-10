import { useDatabase } from '@/context/database';
import { Section } from '@/components/ui/section';
import { LogoutDialog, NotAnonymous, RevokeSessionDialog } from '@/components/app/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { getUsername } from '@/lib/usernames';
import { createFileRoute } from '@tanstack/react-router';
import { Clock, Globe, Laptop, MapPin, Monitor, Smartphone, Tablet } from 'lucide-react';
import { UAParser } from 'ua-parser-js';
import { useQuery } from '@rocicorp/zero/react';

export const Route = createFileRoute('/_account/account/')({
    component: RouteComponent,
});

function RouteComponent() {
    const db = useDatabase();
    const { data: session } = authClient.useSession();

    const [activeSessions] = useQuery(db.query.session.where('userId', '=', db.userID));

    const getDeviceIcon = (userAgent: string) => {
        const parser = new UAParser(userAgent);
        const device = parser.getDevice();
        const os = parser.getOS();

        if (device.type === 'mobile') return <Smartphone className="size-4" />;
        if (device.type === 'tablet') return <Tablet className="size-4" />;
        if (os.name === 'Mac OS') return <Laptop className="size-4" />;
        if (os.name === 'Windows') return <Monitor className="size-4" />;
        if (os.name === 'Linux') return <Monitor className="size-4" />;
        return <Globe className="size-4" />;
    };

    const getDeviceInfo = (userAgent: string) => {
        const parser = new UAParser(userAgent);
        const browser = parser.getBrowser();
        const os = parser.getOS();
        const device = parser.getDevice();

        const parts = [];
        if (browser.name) parts.push(browser.name);
        if (os.name) parts.push(os.name);
        if (device.model) parts.push(device.model);

        return parts.join(' • ') || 'Unknown device';
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <title>Account | Zeron</title>
            <Section title="Profile" description="Update your account details">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            className="bg-muted/50 backdrop-blur-md border border-foreground/15"
                            placeholder={getUsername(session?.user)}
                        />
                        <p className="text-xs text-muted-foreground">
                            What do you want to be called?
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <p>{session?.user.email}</p>
                        <p className="text-xs text-muted-foreground">
                            The main email address for your account.
                        </p>
                    </div>
                </div>
            </Section>
            <Separator />
            <Section title="Sessions" description="Manage your sessions">
                <div className="flex flex-col gap-4">
                    {activeSessions?.map(sessionItem => {
                        const isCurrentSession = sessionItem.id === session?.session.id;
                        const deviceInfo = sessionItem.userAgent
                            ? getDeviceInfo(sessionItem.userAgent)
                            : 'Unknown device';
                        const deviceIcon = sessionItem.userAgent ? (
                            getDeviceIcon(sessionItem.userAgent)
                        ) : (
                            <Globe className="size-4" />
                        );

                        return (
                            <div
                                key={sessionItem.id}
                                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                                    isCurrentSession
                                        ? 'bg-primary/10 border-primary/20'
                                        : 'bg-muted/50 border-foreground/10 hover:bg-muted/80'
                                }`}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-md ${
                                            isCurrentSession
                                                ? 'bg-primary/20 text-primary'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {deviceIcon}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium truncate">
                                                {deviceInfo}
                                            </span>
                                            {isCurrentSession && (
                                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            {sessionItem.ipAddress && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="size-3" />
                                                    <span>{sessionItem.ipAddress}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Clock className="size-3" />
                                                <span>
                                                    {formatDate(new Date(sessionItem.createdAt))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!isCurrentSession && (
                                    <RevokeSessionDialog token={sessionItem.token}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <span>Revoke</span>
                                        </Button>
                                    </RevokeSessionDialog>
                                )}

                                <NotAnonymous>
                                    {isCurrentSession && (
                                        <LogoutDialog>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <span>Logout</span>
                                            </Button>
                                        </LogoutDialog>
                                    )}
                                </NotAnonymous>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
