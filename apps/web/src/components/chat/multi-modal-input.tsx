import { ThreadMessage } from '@/components/chat/types';
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
import { useNavigate } from '@tanstack/react-router';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';

const PromptSchema = z.object({
    message: z.string().min(1),
});

export function MultiModalInput({
    id,
    sendMessage,
    status,
    stop,
}: PromptInputProps<ThreadMessage>) {
    const threadId = useParamsThreadId();
    const navigate = useNavigate();

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
            await navigate({
                to: '/$threadId',
                params: {
                    threadId: id,
                },
                replace: Boolean(threadId),
            });
            await sendMessage({ text: value.message });
            form.reset();
        },
    });

    return (
        <form
            className="absolute bottom-0 left-0 right-0 p-4"
            onSubmit={e => {
                e.preventDefault();
                if (status === 'streaming' || status === 'submitted') {
                    stop();
                } else {
                    form.handleSubmit();
                }
            }}
        >
            <form.Field
                name="message"
                children={field => (
                    <PromptInput
                        className="max-w-3xl mx-auto p-3 bg-muted/50 backdrop-blur-md"
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
