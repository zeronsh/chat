import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/hooks/use-settings';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod';
import { useDatabase } from '@/context/database';

export const Route = createFileRoute('/_account/account/preferences')({
    component: RouteComponent,
});

function RouteComponent() {
    const settings = useSettings();
    const db = useDatabase();
    const form = useForm({
        defaultValues: {
            nickname: settings?.nickname ?? '',
            biography: settings?.biography ?? '',
            instructions: settings?.instructions ?? '',
        },
        onSubmit: async ({ value }) => {
            if (!settings) return;

            await db.mutate.setting.update({
                id: settings.id,
                nickname: value.nickname,
                biography: value.biography,
                instructions: value.instructions,
            });
            toast.success('Preferences saved');
        },
        validators: {
            onChange: z.object({
                nickname: z.string().min(0),
                biography: z.string().min(0),
                instructions: z.string().min(0),
            }),
        },
    });

    return (
        <form
            className="flex flex-col gap-8"
            onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <title>Preferences | Zeron</title>
            <Section title="Preferences" description="Customize your preferences here.">
                <form.Field
                    name="nickname"
                    children={field => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                placeholder="Enter your nickname"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                className="bg-muted/50 backdrop-blur-md border border-foreground/15"
                                onChange={e => field.handleChange(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                What do you want Zeron Chat to call you?
                            </p>
                        </div>
                    )}
                />
                <form.Field
                    name="biography"
                    children={field => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="biography">Biography</Label>
                            <Textarea
                                id="biography"
                                className="resize-none bg-muted/50 backdrop-blur-md border border-foreground/15"
                                placeholder="Enter your biography"
                                rows={5}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={e => field.handleChange(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                What should Zeron Chat know about you?
                            </p>
                        </div>
                    )}
                />
            </Section>
            <Separator />
            <Section title="System" description="Customize your system prompt here.">
                <form.Field
                    name="instructions"
                    children={field => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea
                                id="instructions"
                                className="resize-none bg-muted/50 backdrop-blur-md border border-foreground/15"
                                placeholder="Enter your instructions"
                                rows={5}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={e => field.handleChange(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                How do you want Zeron Chat to behave?
                            </p>
                        </div>
                    )}
                />
            </Section>
            <div className="flex justify-end">
                <form.Subscribe
                    selector={state => ({
                        isSubmitting: state.isSubmitting,
                        canSubmit: state.canSubmit,
                    })}
                    children={({ canSubmit, isSubmitting }) => (
                        <Button type="submit" disabled={!canSubmit || isSubmitting}>
                            Save
                        </Button>
                    )}
                />
            </div>
        </form>
    );
}
