import { Button } from '@/components/ui/button';
import {
    PromptInput,
    PromptInputTextarea,
    PromptInputActions,
    PromptInputAction,
} from '@/components/ui/prompt-input';
import {
    SquareIcon,
    ArrowUpIcon,
    GlobeIcon,
    Paperclip,
    LoaderIcon,
    TelescopeIcon,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';
import { cn } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { useRef } from 'react';
import { FileAttachment } from './file-attachment';
import { toast } from 'sonner';
import { useThreadContext, useThreadSelector } from '@/context/thread';
import type { FileAttachment as FileAttachmentType } from '@/thread/store';

export function MultiModalInput() {
    const id = useThreadSelector(state => state.id!);
    const status = useThreadSelector(state => state.status);
    const input = useThreadSelector(state => state.input);
    const tool = useThreadSelector(state => state.tool);
    const attachments = useThreadSelector(state => state.attachments);
    const pendingFileCount = useThreadSelector(state => state.pendingFileCount);
    const setPendingFileCount = useThreadSelector(state => state.setPendingFileCount);
    const setAttachments = useThreadSelector(state => state.setAttachments);
    const setInput = useThreadSelector(state => state.setInput);
    const setTool = useThreadSelector(state => state.setTool);

    const { sendMessage, stop } = useThreadContext();

    const { startUpload, isUploading } = useUploadThing('fileUploader', {
        onUploadBegin: () => {
            setPendingFileCount(prev => prev + 1);
        },
        onClientUploadComplete: files => {
            setPendingFileCount(prev => prev - files.length);
            const newAttachments: FileAttachmentType[] = files.map(file => ({
                type: 'file' as const,
                url: file.ufsUrl,
                filename: file.name,
                mediaType: file.type,
            }));
            setAttachments([...attachments, ...newAttachments]);
        },
        onUploadError: error => {
            toast.error(error.message);
            setPendingFileCount(prev => prev - 1);
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

    const handleSubmit = async () => {
        if (!input.trim()) return;

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
                    ...attachments,
                    {
                        type: 'text',
                        text: input,
                    },
                ],
            },
            {
                body: {
                    tool: tool || undefined,
                },
            }
        );

        // Reset form state
        setInput('');
        setAttachments([]);
        setTool('');
    };

    const canSubmit = input.trim().length > 0;

    return (
        <form
            className={cn({
                'absolute px-4 pt-4 flex flex-col gap-4': true,
                'bottom-0 left-0 right-0': true,
            })}
            onSubmit={e => {
                e.preventDefault();
                if (status === 'streaming' || status === 'submitted') {
                    stop();
                } else {
                    handleSubmit();
                }
            }}
        >
            <PromptInput
                className="max-w-3xl mx-auto p-3 bg-muted/50 backdrop-blur-md w-full border-foreground/10"
                value={input}
                onValueChange={setInput}
                onSubmit={handleSubmit}
            >
                <div className="flex gap-2">
                    {attachments.map(attachment => (
                        <FileAttachment
                            key={attachment.url}
                            url={attachment.url}
                            name={attachment.filename}
                            mediaType={attachment.mediaType}
                            onRemove={() => {
                                setAttachments(attachments.filter(a => a.url !== attachment.url));
                            }}
                        />
                    ))}
                    {Array.from({ length: pendingFileCount }).map((_, index) => (
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
                            onClick={() => setTool(tool === 'search' ? '' : 'search')}
                        >
                            <GlobeIcon className="size-5" />
                            <span className="text-sm">Search</span>
                        </Button>
                    </PromptInputAction>
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
                            onClick={() => setTool(tool === 'research' ? '' : 'research')}
                        >
                            <TelescopeIcon className="size-5" />
                            <span className="text-sm">Research</span>
                            <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full hidden md:block">
                                BETA
                            </span>
                        </Button>
                    </PromptInputAction>
                    <div className="flex-1" />
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
                            disabled={!canSubmit || isUploading}
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
        </form>
    );
}
