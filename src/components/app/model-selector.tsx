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
import { useState } from 'react';

import ModelIcon, { type ModelType } from '@/components/thread/model-icon';
import { ChevronsUpDown } from 'lucide-react';
import { useDatabase } from '@/context/database';
import { useQuery } from '@rocicorp/zero/react';

export function ModelSelector() {
    const [open, setOpen] = useState(false);
    const db = useDatabase();
    const [models] = useQuery(db.query.model);
    const settings = useSettings();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="md:w-[200px] justify-between"
                >
                    <div className="flex items-center gap-2 flex-1 md:w-0">
                        {settings?.model && (
                            <ModelIcon
                                className="fill-primary"
                                model={settings.model.icon as ModelType}
                            />
                        )}
                        <span className="truncate hidden md:block">{settings?.model?.name}</span>
                    </div>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 bg-background/50 border-foreground/10 backdrop-blur-md overflow-hidden"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Search model..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No model found.</CommandEmpty>
                        <CommandGroup>
                            {models?.map(model => (
                                <CommandItem
                                    key={model.id}
                                    value={model.name}
                                    onSelect={() => {
                                        setOpen(false);
                                        if (settings) {
                                            db.mutate.setting.update({
                                                id: settings.id,
                                                modelId: model.id,
                                            });
                                        }
                                        // setHoveredModel(null);
                                        // selectModel({ modelId: model._id });
                                    }}
                                    onMouseEnter={() => {
                                        // setHoveredModel(model);
                                    }}
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
                                        {model.id === settings?.model?.id && (
                                            <span className="text-xs text-muted-foreground">
                                                Selected
                                            </span>
                                        )}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
