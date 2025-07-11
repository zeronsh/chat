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
import {
    SquareIcon,
    ArrowUpIcon,
    GlobeIcon,
    Paperclip,
    UploadIcon,
    LoaderIcon,
} from 'lucide-react';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useUploadThing } from '@/lib/uploadthing';
import { useRef, useState } from 'react';
import { FileAttachment } from './file-attachment';

const PromptSchema = z.object({
    message: z.string().min(1),
    attachments: z.array(
        z.object({
            type: z.literal('file'),
            url: z.string(),
            filename: z.string(),
            mediaType: z.string(),
        })
    ),
});

export function MultiModalInput({
    id,
    sendMessage,
    status,
    stop,
}: PromptInputProps<ThreadMessage>) {
    const [pendingCount, setPendingCount] = useState(0);
    const { startUpload, isUploading } = useUploadThing('fileUploader', {
        onUploadBegin: fileName => {
            console.log('Uploading file:', fileName);
            setPendingCount(prev => prev + 1);
        },
        onUploadProgress: progress => {
            console.log('Upload progress:', progress);
        },
        onClientUploadComplete: files => {
            setPendingCount(prev => prev - files.length);
            form.setFieldValue('attachments', [
                ...form.getFieldValue('attachments'),
                ...files.map(file => ({
                    type: 'file' as const,
                    url: file.ufsUrl,
                    filename: file.name,
                    mediaType: file.type,
                })),
            ]);
        },
        onUploadError: error => {
            console.error('Upload error:', error);
            setPendingCount(prev => prev - 1);
        },
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const threadId = useParamsThreadId();
    const navigate = useNavigate();

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        await startUpload(Array.from(files));
    };

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };

    const form = useForm({
        defaultValues: {
            message: '',
            attachments: [] as z.infer<typeof PromptSchema>['attachments'],
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
            sendMessage({
                role: 'user',
                parts: [
                    ...value.attachments,
                    {
                        type: 'text',
                        text: value.message,
                    },
                ],
            });
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
                    <motion.div layoutId="prompt-input" layout="position">
                        <PromptInput
                            className="max-w-3xl mx-auto p-3 bg-muted/50 backdrop-blur-md w-full"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            onSubmit={form.handleSubmit}
                        >
                            <div className="flex gap-2 p-2">
                                <form.Subscribe selector={form => form.values.attachments}>
                                    {attachments =>
                                        attachments.map(attachment => (
                                            <FileAttachment
                                                key={attachment.url}
                                                url={attachment.url}
                                                name={attachment.filename}
                                                mediaType={attachment.mediaType}
                                                onRemove={() => {
                                                    const currentAttachments =
                                                        form.getFieldValue('attachments');
                                                    form.setFieldValue(
                                                        'attachments',
                                                        currentAttachments.filter(
                                                            a => a.url !== attachment.url
                                                        )
                                                    );
                                                }}
                                            />
                                        ))
                                    }
                                </form.Subscribe>
                                {Array.from({ length: pendingCount }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-24 w-24 bg-muted/50 rounded-md animate-pulse border relative"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                                            <LoaderIcon className="size-6 animate-spin" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <PromptInputTextarea placeholder="Ask me anything..." />
                            <PromptInputActions className="flex items-center">
                                <PromptInputAction tooltip="Attach files">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        type="button"
                                        onClick={handlePaperclipClick}
                                    >
                                        <Paperclip className="size-5" />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,application/pdf"
                                            multiple={true}
                                            className="hidden"
                                            onChange={e => handleFileUpload(e.target.files)}
                                        />
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
                                    <form.Subscribe
                                        selector={form => ({
                                            canSubmit: form.canSubmit,
                                        })}
                                    >
                                        {({ canSubmit }) => (
                                            <Button
                                                type="submit"
                                                variant="default"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                disabled={!canSubmit || isUploading}
                                            >
                                                {status === 'streaming' ||
                                                status === 'submitted' ? (
                                                    <SquareIcon className="size-5 fill-current" />
                                                ) : (
                                                    <ArrowUpIcon className="size-5" />
                                                )}
                                            </Button>
                                        )}
                                    </form.Subscribe>
                                </PromptInputAction>
                            </PromptInputActions>
                        </PromptInput>
                    </motion.div>
                )}
            />
        </form>
    );
}
