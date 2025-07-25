import { Button } from '@/components/ui/button';
import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowLeftIcon, MailIcon } from 'lucide-react';

export const Route = createFileRoute('/_account/magic-link')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-1 items-center justify-center relative w-full h-full p-4">
            <div className="flex flex-col p-8 gap-6 items-center max-w-md col-span-1 justify-center row-span-3">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-2">
                        <MailIcon className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xl font-semibold text-foreground">Magic Link Sent</span>
                    <span className="text-muted-foreground text-sm text-center">
                        We've sent a magic link to your email address. Check your inbox and click
                        the link to sign in to your account.
                    </span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <div className="w-full">
                        <Button asChild className="w-full">
                            <Link to="/">
                                <ArrowLeftIcon className="size-4" />
                                <span className="text-primary-foreground">Back to Home</span>
                            </Link>
                        </Button>
                    </div>

                    <div className="w-full">
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/login">
                                <span className="text-sm">Try Another Email</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
