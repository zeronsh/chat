import { Button } from '@/components/ui/button';
import {
    PromptInput,
    PromptInputTextarea,
    PromptInputActions,
    PromptInputAction,
} from '@/components/ui/prompt-input';
import { useForm } from '@tanstack/react-form';
import { PromptInputProps } from '@zeronsh/ai/react';
import { SquareIcon, ArrowUpIcon } from 'lucide-react';
import { z } from 'zod';

const PromptSchema = z.object({
    message: z.string().min(1),
});

export function MultiModalInput({ sendMessage, status }: PromptInputProps<any>) {
    const form = useForm({
        defaultValues: {
            message: '',
        },
        validators: {
            onMount: PromptSchema,
            onChange: PromptSchema,
            onSubmit: PromptSchema,
        },
        onSubmit: async ({ value }) => {
            sendMessage({ text: value.message });
            form.reset();
        },
    });

    return (
        <form
            className="absolute bottom-0 left-0 right-0 bg-background p-4"
            onSubmit={e => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.Field
                name="message"
                children={field => (
                    <PromptInput
                        className="max-w-3xl mx-auto"
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        onSubmit={form.handleSubmit}
                    >
                        <PromptInputTextarea placeholder="Ask me anything..." />
                        <PromptInputActions className="flex items-center justify-end">
                            <PromptInputAction
                                tooltip={
                                    status === 'streaming' || status === 'submitted'
                                        ? 'Stop generation'
                                        : 'Send message'
                                }
                            >
                                <Button
                                    type="submit"
                                    variant="default"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                >
                                    {status === 'streaming' || status === 'submitted' ? (
                                        <SquareIcon className="size-5 fill-current" />
                                    ) : (
                                        <ArrowUpIcon className="size-5" />
                                    )}
                                </Button>
                            </PromptInputAction>
                        </PromptInputActions>
                    </PromptInput>
                )}
            />
        </form>
    );
}
