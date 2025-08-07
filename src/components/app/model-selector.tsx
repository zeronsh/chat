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
import { useSettings } from '@/hooks/use-settings';
import { Fragment, useEffect, useState } from 'react';

import ModelIcon, { type ModelType } from '@/components/thread/model-icon';
import { BrainIcon, ChevronsUpDown, EyeIcon, FileIcon, WrenchIcon } from 'lucide-react';
import { useDatabase } from '@/context/database';
import { useQuery } from '@rocicorp/zero/react';
import { Model } from '@/zero/types';
import { Badge } from '@/components/ui/badge';
import { match } from 'ts-pattern';
import { useAccess } from '@/hooks/use-access';
import { cn } from '@/lib/utils';
import { ProDialog } from '@/components/app/pro-dialog';
import { AccountDialog } from '@/components/app/account-dialog';
import {
    InsufficientCreditsProDialog,
    InsufficientCreditsDialog,
} from '@/components/app/insufficient-dialog';

export function ModelSelector() {
    const [open, setOpen] = useState(false);
    const [hoveredModel, setHoveredModel] = useState<Model | null>(null);
    const db = useDatabase();
    const [allModels] = useQuery(db.query.model);
    const settings = useSettings();
    const models = allModels.filter(model => settings?.pinnedModels?.includes(model.id));
    const access = useAccess();
    const [proDialogOpen, setProDialogOpen] = useState(false);
    const [accountDialogOpen, setAccountDialogOpen] = useState(false);
    const [insufficientCreditsProDialogOpen, setInsufficientCreditsProDialogOpen] = useState(false);
    const [insufficientCreditsDialogOpen, setInsufficientCreditsDialogOpen] = useState(false);

    useEffect(() => {
        if (!open) {
            setHoveredModel(null);
        }
    }, [open]);

    return (
        <Fragment>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" aria-expanded={open}>
                        <div className="flex items-center gap-2 flex-1 ">
                            {settings?.model && (
                                <ModelIcon
                                    className="fill-primary"
                                    model={settings.model.icon as ModelType}
                                />
                            )}
                            <span className="truncate hidden md:block">
                                {settings?.model?.name}
                            </span>
                        </div>
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 relative" align="start">
                    <Command>
                        <CommandInput placeholder="Find Model..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No model found.</CommandEmpty>
                            <CommandGroup heading="Models">
                                {models?.map(model => (
                                    <CommandItem
                                        key={model.id}
                                        value={model.name}
                                        onMouseEnter={() => setHoveredModel(model)}
                                        onSelect={() => {
                                            setOpen(false);
                                            if (access.checkCanUseModel(model)) {
                                                if (settings) {
                                                    db.mutate.setting.update({
                                                        id: settings.id,
                                                        modelId: model.id,
                                                    });
                                                }
                                            } else {
                                                access.getCannotUseModelMatcher(model, {
                                                    onPremiumRequired: () => {
                                                        setProDialogOpen(true);
                                                    },
                                                    onAccountRequired: () => {
                                                        setAccountDialogOpen(true);
                                                    },
                                                    onInsufficientCreditsPro: () => {
                                                        setInsufficientCreditsProDialogOpen(true);
                                                    },
                                                    onInsufficientCreditsNotPro: () => {
                                                        setInsufficientCreditsDialogOpen(true);
                                                    },
                                                    onInsufficientCreditsAnonymous: () => {
                                                        setInsufficientCreditsDialogOpen(true);
                                                    },
                                                });
                                            }
                                        }}
                                        className={cn(
                                            !access.checkCanUseModel(model) && 'opacity-50'
                                        )}
                                    >
                                        <span className="flex items-center gap-2 flex-1">
                                            {model.icon && (
                                                <ModelIcon
                                                    className="fill-primary"
                                                    model={model.icon as ModelType}
                                                />
                                            )}
                                            <span className="truncate">{model.name}</span>
                                            <div className="flex-1" />
                                            {model.access === 'premium_required' && (
                                                <Badge variant="outline" className="text-xs">
                                                    PRO
                                                </Badge>
                                            )}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <div className="absolute top-0 right-0 translate-x-full pl-2 hidden md:block">
                        {hoveredModel && (
                            <div className="rounded-md flex flex-col gap-4 w-64 border border-foreground/10 overflow-hidden relative before:bg-sidebar/50 before:backdrop-blur-md before:absolute before:inset-0 before:z-[-1]">
                                <div className="flex items-center gap-2 px-2 pt-2">
                                    <ModelIcon
                                        className="size-4 fill-primary"
                                        model={hoveredModel.icon as ModelType}
                                    />
                                    <span className="text-sm">{hoveredModel.name}</span>
                                </div>
                                <div className="text-sm text-muted-foreground px-2">
                                    {hoveredModel.description}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-between px-2 border-t border-foreground/10 pt-4">
                                    <div>Cost</div>
                                    <div>
                                        <span className="font-semibold">
                                            {hoveredModel.credits} credit
                                            {Number(hoveredModel.credits ?? 0) > 1 ? 's' : ''}
                                        </span>
                                        /message
                                    </div>
                                </div>
                                <div className="text-sm flex gap-2 flex-wrap p-2 border-t border-foreground/10">
                                    {hoveredModel.capabilities
                                        ?.sort((a, b) => a.localeCompare(b))
                                        .map(c => (
                                            <Badge
                                                key={c}
                                                variant="outline"
                                                className="text-xs flex items-center gap-1"
                                            >
                                                {match(c)
                                                    .with('reasoning', () => (
                                                        <BrainIcon className="size-4 text-pink-400" />
                                                    ))
                                                    .with('vision', () => (
                                                        <EyeIcon className="size-4 text-blue-400" />
                                                    ))
                                                    .with('documents', () => (
                                                        <FileIcon className="size-4 text-yellow-400" />
                                                    ))
                                                    .with('tools', () => (
                                                        <WrenchIcon className="size-4 text-green-400" />
                                                    ))
                                                    .exhaustive()}
                                                <span className="text-xs">
                                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                                </span>
                                            </Badge>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
            <ProDialog open={proDialogOpen} setOpen={setProDialogOpen} />
            <AccountDialog open={accountDialogOpen} setOpen={setAccountDialogOpen} />
            <InsufficientCreditsProDialog
                open={insufficientCreditsProDialogOpen}
                setOpen={setInsufficientCreditsProDialogOpen}
            />
            <InsufficientCreditsDialog
                open={insufficientCreditsDialogOpen}
                setOpen={setInsufficientCreditsDialogOpen}
            />
        </Fragment>
    );
}
