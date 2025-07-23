import { Button } from '@/components/ui/button';
import {
    PromptInput,
    PromptInputTextarea,
    PromptInputActions,
    PromptInputAction,
} from '@/components/ui/prompt-input';
import { useForm } from '@tanstack/react-form';
import {
    SquareIcon,
    ArrowUpIcon,
    GlobeIcon,
    Paperclip,
    LoaderIcon,
    TelescopeIcon,
} from 'lucide-react';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';
import { cn } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { useRef, useState } from 'react';
import { FileAttachment } from './file-attachment';
import { FileDropArea } from '@/components/thread/file-drop-area';
import { toast } from 'sonner';
import { useThreadContext, useThreadSelector } from '@/context/thread';

const PromptSchema = z.object({
    message: z.string().min(1),
    tool: z.string().min(0),
    attachments: z.array(
        z.object({
            type: z.literal('file'),
            url: z.string(),
            filename: z.string(),
            mediaType: z.string(),
        })
    ),
});

export function MultiModalInput() {
    const id = useThreadSelector(state => state.id!);
    const status = useThreadSelector(state => state.status);
    const { sendMessage, stop } = useThreadContext();
    const [pendingCount, setPendingCount] = useState(0);
    const { startUpload, isUploading } = useUploadThing('fileUploader', {
        onUploadBegin: () => {
            setPendingCount(prev => prev + 1);
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
            toast.error(error.message);
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
            tool: '',
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
            sendMessage(
                {
                    role: 'user',
                    parts: [
                        ...value.attachments,
                        {
                            type: 'text',
                            text: value.message,
                        },
                    ],
                },
                {
                    body: {
                        tool: value.tool,
                    },
                }
            );
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
            <FileDropArea onUpload={handleFileUpload} className="max-w-3xl mx-auto w-full">
                <form.Field
                    name="message"
                    children={field => (
                        <PromptInput
                            className="max-w-3xl mx-auto p-3 bg-muted/50 backdrop-blur-md w-full"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            onSubmit={form.handleSubmit}
                        >
                            <div className="flex gap-2">
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
                                        className="h-24 w-24 bg-muted/50 rounded-2xl animate-pulse border relative"
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
                                <form.Subscribe selector={form => form.values.tool}>
                                    {tool => (
                                        <PromptInputAction tooltip={'Search the web'}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                type="button"
                                                className={cn(
                                                    'h-8 rounded-full',
                                                    tool === 'search' &&
                                                        'text-primary hover:text-primary border-primary!'
                                                )}
                                                onClick={() =>
                                                    form.setFieldValue(
                                                        'tool',
                                                        tool === 'search' ? '' : 'search'
                                                    )
                                                }
                                            >
                                                <GlobeIcon className="size-5" />
                                                <span className="text-sm">Search</span>
                                            </Button>
                                        </PromptInputAction>
                                    )}
                                </form.Subscribe>
                                <form.Subscribe selector={form => form.values.tool}>
                                    {tool => (
                                        <PromptInputAction tooltip={'Deep research'}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                type="button"
                                                className={cn(
                                                    'h-8 rounded-full',
                                                    tool === 'research' &&
                                                        'text-primary hover:text-primary border-primary!'
                                                )}
                                                onClick={() =>
                                                    form.setFieldValue(
                                                        'tool',
                                                        tool === 'research' ? '' : 'research'
                                                    )
                                                }
                                            >
                                                <TelescopeIcon className="size-5" />
                                                <span className="text-sm">Research</span>
                                                <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full hidden md:block">
                                                    BETA
                                                </span>
                                            </Button>
                                        </PromptInputAction>
                                    )}
                                </form.Subscribe>
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
                    )}
                />
            </FileDropArea>
        </form>
    );
}
