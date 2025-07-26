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
                <Button variant="ghost" aria-expanded={open}>
                    <div className="flex items-center gap-2 flex-1 ">
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
            <PopoverContent className="p-0 overflow-hidden" align="start">
                <Command>
                    <CommandInput placeholder="Find Model..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No model found.</CommandEmpty>
                        <CommandGroup heading="Models">
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
