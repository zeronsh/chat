import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

import { ChevronsUpDown, PlusIcon } from 'lucide-react';
import { useDatabase } from '@/context/database';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUsername } from '@/lib/usernames';
import { useQuery } from '@rocicorp/zero/react';
import { Link } from '@tanstack/react-router';

export function OrganizationSelector() {
    const [open, setOpen] = useState(false);
    const { data: session } = authClient.useSession();
    const db = useDatabase();
    const [organizations] = useQuery(db.query.organization);
    const { data: activeOrganization } = authClient.useActiveOrganization();
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" aria-expanded={open} className="w-full justify-between ">
                    <div className="flex items-center gap-2 flex-1 md:w-0">
                        {!activeOrganization && session && (
                            <div className="flex items-center gap-2">
                                <Avatar className="overflow-hidden size-6 border border-foreground/10">
                                    <AvatarImage src={session?.user.image ?? undefined} />
                                    <AvatarFallback className="text-xs">
                                        {getUsername(session?.user).charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">My Account</span>
                            </div>
                        )}
                    </div>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 bg-background/50 border-foreground/10 backdrop-blur-md overflow-hidden"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Find Team..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                onSelect={async () => {
                                    await authClient.organization.setActive({
                                        organizationId: null,
                                    });
                                    setOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar className="overflow-hidden size-6 border border-foreground/10">
                                        <AvatarImage src={session?.user.image ?? undefined} />
                                        <AvatarFallback className="text-xs">
                                            {getUsername(session?.user).charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">My Account</span>
                                </div>
                            </CommandItem>
                            {organizations.map(organization => (
                                <CommandItem
                                    key={organization.id}
                                    onSelect={async () => {
                                        await authClient.organization.setActive({
                                            organizationId: organization.id,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="overflow-hidden size-6 border border-foreground/10">
                                            <AvatarImage src={organization.logo ?? undefined} />
                                            <AvatarFallback className="text-xs">
                                                {organization.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{organization.name}</span>
                                    </div>
                                </CommandItem>
                            ))}
                            <CommandItem>
                                <Link to="/team/create" className="flex items-center gap-2 w-full">
                                    <div className="size-6 border border-foreground/10 rounded-full flex items-center justify-center">
                                        <PlusIcon className="size-4" />
                                    </div>
                                    <span className="text-sm">Create Team</span>
                                </Link>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
