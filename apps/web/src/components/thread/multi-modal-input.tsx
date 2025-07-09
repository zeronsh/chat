import { ThreadMessage } from '@/lib/types';
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
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
            sendMessage({ text: value.message });
            form.reset();
        },
    });

    return (
        <motion.form
            layout
            layoutId="prompt-input"
            className={cn({
                'absolute px-4 pt-4': true,
                'bottom-0 left-0 right-0': threadId,
                'top-48 left-0 right-0': !threadId,
            })}
            onSubmit={e => {
                e.preventDefault();
                if (status === 'streaming' || status === 'submitted') {
                    stop();
                } else {
                    form.handleSubmit();
                }
            }}
        >
            <div
                className={cn({
                    'absolute top-0 left-0 right-0 translate-y-[-100%] transition-opacity duration-300 p-4': true,
                    'opacity-0 pointer-events-none': threadId,
                })}
            >
                <div className="flex items-center justify-center h-full">
                    <p className="text-2xl font-semibold text-muted-foreground">
                        What's on your mind?
                    </p>
                </div>
            </div>
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
                                    className="h-6 w-6 rounded-full"
                                >
                                    {status === 'streaming' || status === 'submitted' ? (
                                        <SquareIcon className="size-4 fill-current" />
                                    ) : (
                                        <ArrowUpIcon className="size-4" />
                                    )}
                                </Button>
                            </PromptInputAction>
                        </PromptInputActions>
                    </PromptInput>
                )}
            />
        </motion.form>
    );
}
