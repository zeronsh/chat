import { Button } from '@/components/ui/button';
import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowLeftIcon, CheckCircleIcon } from 'lucide-react';

export const Route = createFileRoute('/_account/logged-out')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-1 items-center justify-center relative w-full h-full p-4">
            <div className="flex flex-col p-8 gap-6 items-center max-w-md col-span-1 justify-center row-span-3">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                        <CheckCircleIcon className="size-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xl font-semibold text-foreground">
                        Logged Out Successfully
                    </span>
                    <span className="text-muted-foreground text-sm text-center">
                        You have been successfully logged out of your account. Thank you for using
                        Zeron.
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
                                <span className="text-sm">Log In Again</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
