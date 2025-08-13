import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSettings } from '@/hooks/use-database';
import { Fragment, useEffect, useState } from 'react';

import ModelIcon, { type ModelType } from '@/components/thread/model-icon';
import {
    BrainIcon,
    ChevronsUpDown,
    EyeIcon,
    FileIcon,
    WrenchIcon,
    Pin,
    PinOff,
} from 'lucide-react';
import { useDatabase } from '@/hooks/use-database';
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
import { dialogStore } from '@/stores/dialogs';

export function ModelSelector() {
    const [open, setOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [hoveredModel, setHoveredModel] = useState<Model | null>(null);
    const db = useDatabase();
    const [allModels] = useQuery(db.query.model);
    const settings = useSettings();
    const pinnedModelIds = settings?.pinnedModels || [];
    const models = allModels.filter(model => pinnedModelIds.includes(model.id));
    const otherModels = allModels.filter(model => !pinnedModelIds.includes(model.id));
    const access = useAccess();
    const [accountDialogOpen, setAccountDialogOpen] = useState(false);
    const [insufficientCreditsProDialogOpen, setInsufficientCreditsProDialogOpen] = useState(false);
    const [insufficientCreditsDialogOpen, setInsufficientCreditsDialogOpen] = useState(false);
    const setProDialogOpen = dialogStore(store => store.proDialog.setOpen);

    useEffect(() => {
        if (!open) {
            setHoveredModel(null);
            setShowAll(false);
        }
    }, [open]);

    const handleSelectModel = (model: Model) => {
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
                    setProDialogOpen(true);
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
    };

    const handleTogglePin = (modelId: string, shouldPin: boolean) => {
        if (!settings) return;
        const current = settings.pinnedModels || [];
        const activeModelCount = current.length;
        let updated: string[];
        if (shouldPin) {
            if (current.includes(modelId)) return;
            updated = [...current, modelId];
        } else {
            if (activeModelCount <= 1) {
                return; // keep at least one pinned
            }
            updated = current.filter(id => id !== modelId);
        }
        db.mutate.setting.update({ id: settings.id, pinnedModels: updated });
    };

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
                            {settings?.model?.access === 'premium_required' && (
                                <Badge variant="outline" className="text-[10px]">
                                    PRO
                                </Badge>
                            )}
                        </div>
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn('p-0 relative')} align="start">
                    <Command>
                        <CommandInput placeholder="Find Model..." className="h-9" />
                        <CommandList className={cn(showAll && 'max-h-[500px]')}>
                            <CommandEmpty>No model found.</CommandEmpty>
                            {!showAll && (
                                <CommandGroup heading="Models">
                                    {models?.map(model => (
                                        <CommandItem
                                            key={model.id}
                                            value={`${model.name} ${model.description}`}
                                            onMouseEnter={() => setHoveredModel(model)}
                                            onSelect={() => handleSelectModel(model)}
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
                                                {model.access === 'premium_required' && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px]"
                                                    >
                                                        PRO
                                                    </Badge>
                                                )}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {showAll && (
                                <>
                                    <CommandGroup heading="Pinned Models">
                                        {models?.map(model => (
                                            <CommandItem
                                                key={`pinned-${model.id}`}
                                                value={`${model.name}`}
                                                onMouseEnter={() => setHoveredModel(model)}
                                                onSelect={() => handleSelectModel(model)}
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
                                                    {model.access === 'premium_required' && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            PRO
                                                        </Badge>
                                                    )}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="size-5"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleTogglePin(model.id, false);
                                                        }}
                                                        aria-label="Unpin model"
                                                    >
                                                        <PinOff className="opacity-70 size-3" />
                                                    </Button>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    <CommandSeparator />
                                    <CommandGroup heading="Other Models">
                                        {otherModels?.map(model => (
                                            <CommandItem
                                                key={`other-${model.id}`}
                                                value={`${model.name}`}
                                                onMouseEnter={() => setHoveredModel(model)}
                                                onSelect={() => handleSelectModel(model)}
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
                                                    {model.access === 'premium_required' && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            PRO
                                                        </Badge>
                                                    )}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="size-5"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleTogglePin(model.id, true);
                                                        }}
                                                        aria-label="Pin model"
                                                    >
                                                        <Pin className="opacity-70 size-3" />
                                                    </Button>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                        <CommandSeparator />
                        <div className="flex items-center justify-between p-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => setShowAll(prev => !prev)}
                            >
                                {showAll ? 'Show pinned only' : 'Show all models'}
                            </Button>
                        </div>
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
