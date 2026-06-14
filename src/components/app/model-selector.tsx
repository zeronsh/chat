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
import { useSettings } from '@/hooks/use-database';
import { Fragment, useEffect, useMemo, useState } from 'react';

import ModelIcon, { type ModelType } from '@/components/thread/model-icon';
import { ChevronsUpDown, Pin } from 'lucide-react';
import { useDatabase } from '@/hooks/use-database';
import { useQuery } from '@rocicorp/zero/react';
import { Model } from '@/zero/types';

import { useAccess } from '@/hooks/use-access';
import { cn } from '@/lib/utils';
import { AccountDialog } from '@/components/app/account-dialog';
import {
    InsufficientCreditsProDialog,
    InsufficientCreditsDialog,
} from '@/components/app/insufficient-dialog';
import { dialogStore } from '@/stores/dialogs';
import { CapabilityBadges } from '@/components/ui/capability-badges';
import { formatTokenPrice } from '@/lib/cost';

// Preferred display order for the company filter rail; any icon not listed
// here is appended after, so a newly-seeded provider still shows up.
const COMPANY_ORDER = [
    'anthropic',
    'openai',
    'gemini',
    'google',
    'xai',
    'grok',
    'deepseek',
    'moonshot',
    'zai',
    'qwen',
    'meta',
    'mistral',
] as const;

const PINNED_FILTER = 'pinned';

export function ModelSelector() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>(PINNED_FILTER);
    const [hoveredModel, setHoveredModel] = useState<Model | null>(null);
    const db = useDatabase();
    const [allModels] = useQuery(db.query.model.where('enabled', true));
    const settings = useSettings();
    const pinnedModelIds: string[] = settings?.pinnedModels || [];
    const access = useAccess();
    const [accountDialogOpen, setAccountDialogOpen] = useState(false);
    const [insufficientCreditsProDialogOpen, setInsufficientCreditsProDialogOpen] = useState(false);
    const [insufficientCreditsDialogOpen, setInsufficientCreditsDialogOpen] = useState(false);
    const setProDialogOpen = dialogStore(store => store.proDialog.setOpen);

    useEffect(() => {
        if (!open) {
            setHoveredModel(null);
            setSearch('');
            setFilter(PINNED_FILTER);
        }
    }, [open]);

    // Distinct provider icons present, ordered by preference.
    const companies = useMemo(() => {
        const present = new Set(allModels.map(m => m.icon));
        const ordered = COMPANY_ORDER.filter(c => present.has(c));
        const extras = [...present].filter(c => !ordered.includes(c as (typeof COMPANY_ORDER)[number]));
        return [...ordered, ...extras];
    }, [allModels]);

    const searching = search.trim().length > 0;

    // Typing searches across every model; otherwise the rail filter decides
    // what's listed (pinned, or a single company).
    const visibleModels = useMemo(() => {
        if (searching) return allModels;
        if (filter === PINNED_FILTER) {
            return pinnedModelIds
                .map(id => allModels.find(m => m.id === id))
                .filter((m): m is Model => Boolean(m));
        }
        return allModels.filter(m => m.icon === filter);
    }, [searching, allModels, filter, pinnedModelIds]);

    const handleSelectModel = (model: Model) => {
        setOpen(false);
        if (access.checkCanUseModel(model)) {
            if (settings) {
                db.mutate.setting.update({ id: settings.id, modelId: model.id });
            }
        } else {
            access.getCannotUseModelMatcher(model, {
                onPremiumRequired: () => setProDialogOpen(true),
                onAccountRequired: () => setProDialogOpen(true),
                onInsufficientCreditsPro: () => setInsufficientCreditsProDialogOpen(true),
                onInsufficientCreditsNotPro: () => setInsufficientCreditsDialogOpen(true),
                onInsufficientCreditsAnonymous: () => setInsufficientCreditsDialogOpen(true),
            });
        }
    };

    const handleTogglePin = (modelId: string, shouldPin: boolean) => {
        if (!settings) return;
        const current: string[] = settings.pinnedModels || [];
        let updated: string[];
        if (shouldPin) {
            if (current.includes(modelId)) return;
            updated = [...current, modelId];
        } else {
            if (current.length <= 1) return; // keep at least one pinned
            updated = current.filter(id => id !== modelId);
        }
        db.mutate.setting.update({ id: settings.id, pinnedModels: updated });
    };

    const selectFilter = (next: string) => {
        setFilter(next);
        setSearch('');
    };

    return (
        <Fragment>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        aria-expanded={open}
                        className="h-9 rounded-xl px-3 border border-foreground/8 bg-sidebar/40 hover:bg-sidebar/70 font-normal"
                    >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {settings?.model && (
                                <ModelIcon
                                    className="fill-primary shrink-0"
                                    model={settings.model.icon as ModelType}
                                />
                            )}
                            <span className="truncate text-xs max-w-[160px]">
                                {settings?.model?.name}
                            </span>
                            {settings?.model?.access === 'premium_required' && (
                                <span className="font-mono text-[9px] font-semibold tracking-wider text-primary px-1.5 py-0.5 rounded-full z-1 bg-primary/10">
                                    PRO
                                </span>
                            )}
                        </div>
                        <ChevronsUpDown className="opacity-50 size-3.5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0 relative w-[420px]"
                    align="start"
                    side="top"
                    sideOffset={8}
                >
                    <div className="flex">
                        {/* Filter rail: Pinned + one icon per company. */}
                        <div className="flex flex-col gap-1 p-2 border-r border-border">
                            <RailButton
                                active={!searching && filter === PINNED_FILTER}
                                label="Pinned"
                                onClick={() => selectFilter(PINNED_FILTER)}
                            >
                                <Pin className="size-4" />
                            </RailButton>
                            {companies.map(company => (
                                <RailButton
                                    key={company}
                                    active={!searching && filter === company}
                                    label={company}
                                    onClick={() => selectFilter(company)}
                                >
                                    <ModelIcon
                                        className="size-4 fill-primary"
                                        model={company as ModelType}
                                    />
                                </RailButton>
                            ))}
                        </div>

                        <Command className="flex-1">
                            <CommandInput
                                value={search}
                                onValueChange={setSearch}
                                placeholder="Find model..."
                                className="h-9"
                            />
                            <CommandList className="max-h-[360px]">
                                <CommandEmpty>
                                    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                                        <Pin className="size-5 text-muted-foreground/40" />
                                        <p className="text-sm text-muted-foreground">
                                            {searching
                                                ? 'No models match your search.'
                                                : 'No pinned models yet.'}
                                        </p>
                                        {!searching && (
                                            <p className="text-xs text-muted-foreground/60">
                                                Pick a provider on the left, then pin models to keep
                                                them here.
                                            </p>
                                        )}
                                    </div>
                                </CommandEmpty>
                                <CommandGroup>
                                    {visibleModels.map(model => {
                                        const isPinned = pinnedModelIds.includes(model.id);
                                        return (
                                            <CommandItem
                                                key={model.id}
                                                value={`${model.name} ${model.description}`}
                                                onMouseEnter={() => setHoveredModel(model)}
                                                onSelect={() => handleSelectModel(model)}
                                                className={cn(
                                                    'group',
                                                    !access.checkCanUseModel(model) && 'opacity-50'
                                                )}
                                            >
                                                <span className="flex items-center gap-2 flex-1 min-w-0">
                                                    {model.icon && (
                                                        <ModelIcon
                                                            className="fill-primary shrink-0"
                                                            model={model.icon as ModelType}
                                                        />
                                                    )}
                                                    <span className="truncate">{model.name}</span>
                                                    {model.access === 'premium_required' && (
                                                        <span className="text-[10px] font-medium text-primary px-2 py-0.5 rounded-full z-1 bg-primary/10 shrink-0">
                                                            PRO
                                                        </span>
                                                    )}
                                                </span>
                                                <CapabilityBadges
                                                    capabilities={model.capabilities ?? []}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn(
                                                        'size-5 shrink-0 transition-colors',
                                                        isPinned
                                                            ? 'text-primary hover:text-primary'
                                                            : 'text-muted-foreground/60 hover:text-foreground'
                                                    )}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleTogglePin(model.id, !isPinned);
                                                    }}
                                                    aria-label={isPinned ? 'Unpin model' : 'Pin model'}
                                                >
                                                    {isPinned ? (
                                                        <Pin className="size-3 fill-current" />
                                                    ) : (
                                                        <Pin className="size-3" />
                                                    )}
                                                </Button>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>

                    {/* Detail card — anchored to the bottom so it doesn't clip
                        off-screen now that the selector sits at the page bottom. */}
                    <div className="absolute bottom-0 right-0 translate-x-full pl-2 hidden md:block">
                        {hoveredModel && (
                            <div className="rounded-md flex flex-col gap-4 w-64 border border-foreground/8 overflow-hidden relative before:bg-sidebar/50 before:backdrop-blur-md before:absolute before:inset-0 before:z-[-1]">
                                <div className="flex items-center gap-2 px-2 pt-2">
                                    <ModelIcon
                                        className="size-4 fill-primary"
                                        model={hoveredModel.icon as ModelType}
                                    />
                                    <span className="text-sm">{hoveredModel.name}</span>
                                </div>
                                <div className="flex items-center gap-2 px-2">
                                    <CapabilityBadges capabilities={hoveredModel.capabilities} />
                                </div>
                                <div className="text-sm text-muted-foreground px-2">
                                    {hoveredModel.description}
                                </div>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground px-2 border-t border-foreground/8 pt-4 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>Input</div>
                                        <div>
                                            <span className="font-semibold">
                                                {formatTokenPrice(hoveredModel.inputCost)}
                                            </span>
                                            /M tokens
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>Output</div>
                                        <div>
                                            <span className="font-semibold">
                                                {formatTokenPrice(hoveredModel.outputCost)}
                                            </span>
                                            /M tokens
                                        </div>
                                    </div>
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

function RailButton({
    active,
    label,
    onClick,
    children,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={label}
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                active && 'bg-accent text-foreground ring-1 ring-primary/40'
            )}
        >
            {children}
        </button>
    );
}
