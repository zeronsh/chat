import { Section } from '@/components/ui/section';
import { Switch } from '@/components/ui/switch';
import { useDatabase } from '@/hooks/use-database';
import { useSettings } from '@/hooks/use-database';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@rocicorp/zero/react';
import ModelIcon from '@/components/thread/model-icon';
import { Badge } from '@/components/ui/badge';
import { CapabilityBadges } from '@/components/ui/capability-badges';

export const Route = createFileRoute('/_account/account/models')({
    component: RouteComponent,
});

function RouteComponent() {
    const settings = useSettings();
    const db = useDatabase();
    const [allModels] = useQuery(db.query.model);

    if (!settings) return null;

    const currentPinned = settings.pinnedModels || [];
    const activeModelCount = currentPinned.length;

    const handleModelToggle = (modelId: string, isEnabled: boolean) => {
        let updatedPinned: string[];
        if (isEnabled) {
            updatedPinned = [...currentPinned, modelId];
        } else {
            if (activeModelCount <= 1) {
                return;
            }
            updatedPinned = currentPinned.filter(id => id !== modelId);
        }

        db.mutate.setting.update({
            id: settings.id,
            pinnedModels: updatedPinned,
        });
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <title>Models | Zeron</title>
            <Section
                title="Available Models"
                description="Toggle which models appear in your model selector"
            >
                <div className="space-y-3">
                    {allModels?.map(model => {
                        const isPinned = settings.pinnedModels?.includes(model.id) || false;

                        return (
                            <div
                                key={model.id}
                                className="flex flex-col rounded-lg border bg-card backdrop-blur-md overflow-hidden"
                            >
                                <div className="flex gap-4 flex-1 p-4 border-b">
                                    <div>
                                        <ModelIcon
                                            className="size-6 fill-primary"
                                            model={model.icon}
                                        />
                                    </div>
                                    <div className="flex gap-1 flex-1">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{model.name}</span>
                                                {model.access === 'premium_required' && (
                                                    <Badge variant="outline" className="text-xs">
                                                        PRO
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {model.description}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={isPinned}
                                            disabled={isPinned && activeModelCount <= 1}
                                            onCheckedChange={checked =>
                                                handleModelToggle(model.id, checked)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-sidebar justify-between">
                                    <div>
                                        {model.capabilities && model.capabilities.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <CapabilityBadges
                                                    capabilities={model.capabilities}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {model.credits} credit
                                        {Number(model.credits ?? 0) > 1 ? 's' : ''}/message
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
