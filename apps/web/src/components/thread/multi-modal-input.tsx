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
import { SquareIcon, ArrowUpIcon, GlobeIcon, Paperclip } from 'lucide-react';
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
        <form
            className={cn({
                'absolute px-4 pt-4 flex flex-col gap-4': true,
                'pt-84': !threadId,
                'bottom-0 left-0 right-0': threadId,
                'inset-0': !threadId,
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
            <form.Field
                name="message"
                children={field => (
                    <motion.div layoutId="prompt-input">
                        <PromptInput
                            className="max-w-3xl mx-auto p-3 bg-muted/50 backdrop-blur-md w-full"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            onSubmit={form.handleSubmit}
                        >
                            <PromptInputTextarea placeholder="Ask me anything..." />
                            <PromptInputActions className="flex items-center">
                                <PromptInputAction tooltip="Attach files">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <label htmlFor="file-upload">
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                accept="image/*"
                                                id="file-upload"
                                            />
                                            <Paperclip className="size-5" />
                                        </label>
                                    </Button>
                                </PromptInputAction>
                                <PromptInputAction tooltip={'Search the web'}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-full"
                                    >
                                        <GlobeIcon className="size-5" />
                                        <span className="text-sm">Search</span>
                                    </Button>
                                </PromptInputAction>
                                <div className="flex-1" />

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
                    </motion.div>
                )}
            />
        </form>
    );
}
