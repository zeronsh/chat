import { Anonymous, NotAnonymous } from '@/components/app/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left outline-none transition-colors hover:bg-accent cursor-pointer"
                >
                    <Avatar className="size-7 rounded-md overflow-hidden shrink-0">
                        <AvatarImage className="rounded-none" src={user?.image ?? undefined} />
                        <AvatarFallback className="rounded-none">
                            {getUsername(user).charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm">{getUsername(user)}</span>
                        <span className="truncate text-xs text-muted-foreground">
                            {isPro ? 'Pro' : 'Free'}
                        </span>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-background/50 border-foreground/8 w-[220px] backdrop-blur-md"
                side="right"
                align="end"
                sideOffset={14}
            >
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
