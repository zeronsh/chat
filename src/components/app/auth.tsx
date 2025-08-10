import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth-client';
import { useSession } from '@/hooks/use-session';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export function Anonymous({ children }: { children: React.ReactNode }) {
    const session = useSession();

    if (!session.data) {
        return null;
    }

    if (!session.data.user.isAnonymous) {
        return null;
    }

    return children;
}

export function NotAnonymous({ children }: { children: React.ReactNode }) {
    const session = useSession();

    if (!session.data) {
        return null;
    }

    if (session.data.user.isAnonymous) {
        return null;
    }

    return children;
}

export function LogoutDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Logout</DialogTitle>
                    <DialogDescription>Are you sure you want to logout?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            await authClient.signOut();
                            navigate({ to: '/logged-out' });
                        }}
                    >
                        Logout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function RevokeSessionDialog({
    children,
    token,
}: {
    children: React.ReactNode;
    token: string;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Revoke Session</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to revoke this session?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            await authClient.revokeSession({ token });
                            setOpen(false);
                        }}
                    >
                        Revoke
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
