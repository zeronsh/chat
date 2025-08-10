import { Anonymous, NotAnonymous } from '@/components/app/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccess } from '@/hooks/use-access';
import { useUser } from '@/hooks/use-database';
import { authClient } from '@/lib/auth-client';
import { getUsername } from '@/lib/usernames';
import { Link, useNavigate } from '@tanstack/react-router';
import {
    BotIcon,
    CreditCardIcon,
    LogInIcon,
    LogOutIcon,
    PaintbrushIcon,
    SettingsIcon,
    UserIcon,
} from 'lucide-react';
import { GithubIcon } from 'lucide-react';

export function UserMenu() {
    const user = useUser();
    const { isPro } = useAccess();
    const navigate = useNavigate();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none cursor-pointer" asChild>
                <Button size="icon" variant="ghost" asChild>
                    <Avatar className="rounded-md overflow-hidden">
                        <AvatarImage className="rounded-none" src={user?.image ?? undefined} />
                        <AvatarFallback className="rounded-none">
                            {getUsername(user).charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-background/50 border-foreground/10 w-[200px] backdrop-blur-md"
                align="end"
            >
                <DropdownMenuLabel className="flex items-center gap-2">
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-sm truncate">{getUsername(user)}</div>
                        <div className="text-xs text-muted-foreground truncate">
                            {isPro ? 'Pro' : 'Free'}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/account">
                        <UserIcon className="size-4" />
                        Account
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/account/subscription">
                        <CreditCardIcon className="size-4" />
                        Subscription
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/account/preferences">
                        <SettingsIcon className="size-4" />
                        Preferences
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/account/models">
                        <BotIcon className="size-4" />
                        Models
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/account/appearance">
                        <PaintbrushIcon className="size-4" />
                        Appearance
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <a href="https://github.com/zeronsh/chat" target="_blank" rel="noreferrer">
                        <GithubIcon className="size-4" />
                        GitHub
                    </a>
                </DropdownMenuItem>
                <NotAnonymous>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={async () => {
                            await authClient.signOut();
                            navigate({ to: '/logged-out' });
                        }}
                    >
                        <LogOutIcon className="size-4" />
                        Log out
                    </DropdownMenuItem>
                </NotAnonymous>
                <Anonymous>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to="/login">
                            <LogInIcon className="size-4" />
                            Log in
                        </Link>
                    </DropdownMenuItem>
                </Anonymous>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
