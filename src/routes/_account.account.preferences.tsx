import { Section } from '@/components/ui/section';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/hooks/use-database';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod';
import { useDatabase } from '@/hooks/use-database';
import { SingleFieldForm } from '@/components/app/single-field-form';

export const Route = createFileRoute('/_account/account/preferences')({
    component: RouteComponent,
});

const nicknameSchema = z.object({
    value: z.string().min(0).max(50),
});

const biographySchema = z.object({
    value: z.string().min(0).max(500),
});

const instructionsSchema = z.object({
    value: z.string().min(0).max(1000),
});

function RouteComponent() {
    const settings = useSettings();
    const db = useDatabase();

    const updateSetting = async (field: string, value: string) => {
        if (!settings) return;

        await db.mutate.setting.update({
            id: settings.id,
            [field]: value,
        });

        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        toast.success(`${fieldName} saved`);
    };

    return (
        <div className="flex flex-col gap-8">
            <title>Preferences | Zeron</title>
            <Section title="Preferences" description="Customize your preferences here.">
                <SingleFieldForm
                    label="Nickname"
                    description="What do you want Zeron Chat to call you?"
                    footerMessage="Please use 50 characters or less."
                    defaultValue={settings?.nickname ?? ''}
                    schema={nicknameSchema}
                    renderInput={({ onChange, value }) => (
                        <Input
                            placeholder="Enter your nickname"
                            value={value}
                            className="bg-muted/50 backdrop-blur-md border border-foreground/15"
                            onChange={e => onChange(e.target.value)}
                        />
                    )}
                    onSubmit={value => updateSetting('nickname', value)}
                />

                <SingleFieldForm
                    label="Biography"
                    description="What should Zeron Chat know about you?"
                    footerMessage="Please use 500 characters or less."
                    defaultValue={settings?.biography ?? ''}
                    schema={biographySchema}
                    renderInput={({ onChange, value }) => (
                        <Textarea
                            className="resize-none bg-muted/50 backdrop-blur-md border border-foreground/15"
                            placeholder="Enter your biography"
                            rows={5}
                            value={value}
                            onChange={e => onChange(e.target.value)}
                        />
                    )}
                    onSubmit={value => updateSetting('biography', value)}
                />
            </Section>

            <Separator />

            <Section title="System" description="Customize your system prompt here.">
                <SingleFieldForm
                    label="Instructions"
                    description="How do you want Zeron Chat to behave?"
                    footerMessage="Please use 1000 characters or less."
                    defaultValue={settings?.instructions ?? ''}
                    schema={instructionsSchema}
                    renderInput={({ onChange, value }) => (
                        <Textarea
                            className="resize-none bg-muted/50 backdrop-blur-md border border-foreground/15"
                            placeholder="Enter your instructions"
                            rows={5}
                            value={value}
                            onChange={e => onChange(e.target.value)}
                        />
                    )}
                    onSubmit={value => updateSetting('instructions', value)}
                />
            </Section>
        </div>
    );
}
