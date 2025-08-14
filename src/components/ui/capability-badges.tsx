import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BrainIcon, EyeIcon, FileIcon, WrenchIcon } from 'lucide-react';
import { match } from 'ts-pattern';
import { cn } from '@/lib/utils';
import { Model } from '@/zero/types';

export interface CapabilityBadgesProps {
    capabilities?: Model['capabilities'];
    className?: string;
}

export function CapabilityBadges({ capabilities, className }: CapabilityBadgesProps) {
    if (!capabilities || capabilities.length === 0) {
        return null;
    }

    const sortedCapabilities = [...capabilities].sort((a, b) => a.localeCompare(b));

    return (
        <div className={cn('flex items-center gap-1', className)}>
            {sortedCapabilities.map(capability => (
                <Tooltip key={capability}>
                    <TooltipTrigger>
                        <div
                            className={cn(
                                'text-[10px] font-medium text-primary p-1 rounded-lg z-1',
                                match(capability)
                                    .with('reasoning', () => 'bg-pink-400/10')
                                    .with('vision', () => 'bg-blue-400/10')
                                    .with('documents', () => 'bg-yellow-400/10')
                                    .with('tools', () => 'bg-green-400/10')
                                    .exhaustive()
                            )}
                        >
                            {match(capability)
                                .with('reasoning', () => (
                                    <BrainIcon className="size-3.5 text-pink-400" />
                                ))
                                .with('vision', () => (
                                    <EyeIcon className="size-3.5 text-blue-400" />
                                ))
                                .with('documents', () => (
                                    <FileIcon className="size-3.5 text-yellow-400" />
                                ))
                                .with('tools', () => (
                                    <WrenchIcon className="size-3.5 text-green-400" />
                                ))
                                .exhaustive()}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {capability.charAt(0).toUpperCase() + capability.slice(1)}
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
