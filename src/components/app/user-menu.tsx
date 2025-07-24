import { Anonymous, LogoutDialog, NotAnonymous } from '@/components/app/auth';
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
import { authClient } from '@/lib/auth-client';
import { getUsername } from '@/lib/usernames';
import { Link } from '@tanstack/react-router';
import { LogInIcon, LogOutIcon, PaintbrushIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { GithubIcon } from 'lucide-react';

export function UserMenu() {
    const { data: session } = authClient.useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none cursor-pointer" asChild>
                <Button size="icon" variant="ghost" asChild>
                    <Avatar className="rounded-md overflow-hidden">
                        <AvatarImage
                            className="rounded-none"
                            src={session?.user.image ?? undefined}
                        />
                        <AvatarFallback className="rounded-none">
                            {getUsername(session?.user).charAt(0)}
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
                        <div className="text-sm truncate">{getUsername(session?.user)}</div>
                        <div className="text-xs text-muted-foreground truncate">
                            {session?.user.email ?? 'No email'}
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
                    <Link to="/account/preferences">
                        <SettingsIcon className="size-4" />
                        Preferences
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
                    <a
                        href="https://github.com/wingleeio/chat-zeron"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <GithubIcon className="size-4" />
                        GitHub
                    </a>
                </DropdownMenuItem>
                <NotAnonymous>
                    <DropdownMenuSeparator />
                    <LogoutDialog>
                        <DropdownMenuItem>
                            <LogOutIcon className="size-4" />
                            Log out
                        </DropdownMenuItem>
                    </LogoutDialog>
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
