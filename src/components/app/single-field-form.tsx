import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { FieldState, useForm } from '@tanstack/react-form';
import { Fragment } from 'react/jsx-runtime';
import z from 'zod';

const DefaultSingleFieldSchema = z.object({
    value: z.string().min(1).max(32),
});

export function SingleFieldForm(props: {
    label: string;
    description: string;
    defaultValue: string;
    footerMessage?: string;
    schema?: z.ZodSchema<{ value: string }>;
    renderInput: (props: { onChange: (value: string) => void; value: string }) => React.ReactNode;
    onSubmit: (value: string) => void | Promise<void>;
}) {
    const schema = props.schema || DefaultSingleFieldSchema;

    const form = useForm({
        defaultValues: {
            value: props.defaultValue,
        },
        validators: {
            onBlur: schema,
            onSubmit: schema,
            onMount: schema,
            onChange: schema,
        },
        onSubmit: async ({ value }) => {
            props.onSubmit(value.value);
        },
    });
    return (
        <form
            className="flex flex-col border rounded-lg overflow-hidden bg-card"
            onSubmit={e => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.Field name="value">
                {field => (
                    <Fragment>
                        <div className="flex flex-col gap-4 p-4">
                            <Label htmlFor="username" className="text-lg">
                                {props.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">{props.description}</p>
                            {props.renderInput({
                                value: field.state.value,
                                onChange: field.handleChange,
                            })}
                        </div>
                        <div className="bg-sidebar p-4 flex justify-between items-center border-t">
                            {field.state.meta.errors.length > 0 ? (
                                <p className="text-sm text-destructive">
                                    {field.state.meta.errors[0]?.message}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {props.footerMessage}
                                </p>
                            )}
                            <form.Subscribe
                                selector={state => ({
                                    isSubmitting: state.isSubmitting,
                                    isValid: state.isValid,
                                    isDirty: state.isDirty,
                                })}
                            >
                                {({ isSubmitting, isDirty, isValid }) => (
                                    <Button
                                        size="sm"
                                        type="submit"
                                        disabled={isSubmitting || !isValid || !isDirty}
                                    >
                                        <span>Save</span>
                                    </Button>
                                )}
                            </form.Subscribe>
                        </div>
                    </Fragment>
                )}
            </form.Field>
        </form>
    );
}
