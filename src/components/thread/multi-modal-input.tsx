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
    Paperclip,
    LoaderIcon,
    EditIcon,
    XIcon,
    AlertTriangleIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';
import { cn } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { useEffect, useMemo, useRef } from 'react';
import { FileAttachment } from './file-attachment';
import { toast } from 'sonner';
import { useThreadContext, useThreadSelector } from '@/context/thread';
import type { FileAttachment as FileAttachmentType } from '@/thread/store';
import { useAccess } from '@/hooks/use-access';
import { match, P } from 'ts-pattern';
import { dialogStore } from '@/stores/dialogs';
import { useUser } from '@/hooks/use-database';
import { getUsername } from '@/lib/usernames';
import { ModelSelector } from '@/components/app/model-selector';

function greetingForHour(hour: number) {
    if (hour < 5) return 'Up late';
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

export function MultiModalInput() {
    const id = useThreadSelector(state => state.id!);
    const status = useThreadSelector(state => state.status);
    const input = useThreadSelector(state => state.input);
    const attachments = useThreadSelector(state => state.attachments);
    const pendingFileCount = useThreadSelector(state => state.pendingFileCount);
    const setPendingFileCount = useThreadSelector(state => state.setPendingFileCount);
    const setAttachments = useThreadSelector(state => state.setAttachments);
    const setInput = useThreadSelector(state => state.setInput);
    const setEditingMessageId = useThreadSelector(state => state.setEditingMessageId);
    const editingMessageId = useThreadSelector(state => state.editingMessageId);
    const setMessages = useThreadSelector(state => state.setMessages);
    const setProDialogOpen = dialogStore(store => store.proDialog.setOpen);
    const user = useUser();
    const { sendMessage } = useThreadContext();

    const { startUpload } = useUploadThing('fileUploader', {
        onBeforeUploadBegin: file => {
            setPendingFileCount(prev => prev + 1);
            return file;
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
        if (!input?.trim()) return;

        await navigate({
            to: '/$threadId',
            params: {
                threadId: id,
            },
            replace: Boolean(threadId),
        });

        if (editingMessageId) {
            setMessages(prev =>
                prev.slice(
                    0,
                    prev.findIndex(message => message.id === editingMessageId)
                )
            );
        }

        sendMessage({
            id: editingMessageId,
            role: 'user',
            parts: [
                ...attachments,
                {
                    type: 'text',
                    text: input,
                },
            ],
        });

        // Reset form state
        setInput('');
        setAttachments([]);
        setEditingMessageId(undefined);
    };

    const {
        isPro,
        remainingBudget,
        usagePercent,
        canUseModel,
        cannotUseModelReason,
        canModelViewFiles,
    } = useAccess();

    const matcher = useMemo(() => {
        return match({
            isPro,
            remainingBudget,
            usagePercent,
            status,
            attachments,
            input,
            pendingFileCount,
            canUseModel,
            canModelViewFiles,
        });
    }, [
        isPro,
        remainingBudget,
        usagePercent,
        status,
        attachments,
        input,
        pendingFileCount,
        canUseModel,
        canModelViewFiles,
    ]);

    return (
        <motion.form
            layout="position"
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className={cn(
                'absolute px-4 py-4 flex flex-col gap-8 left-0 right-0',
                threadId ? 'bottom-0' : 'top-[22vh]'
            )}
            onSubmit={async e => {
                e.preventDefault();
                if (status === 'streaming' || status === 'submitted') {
                    await fetch(`/api/thread/${id}/stop`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                } else {
                    await handleSubmit();
                }
            }}
        >
            {!threadId && (
                <motion.div
                    className="max-w-3xl mx-auto w-full"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="font-serif text-4xl italic text-foreground">
                        {greetingForHour(new Date().getHours())}, {getUsername(user)}.
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Ask anything — the transcript starts when you do.
                    </p>
                </motion.div>
            )}
            <PromptInput
                className="max-w-3xl mx-auto p-0 w-full overflow-hidden rounded-2xl border border-foreground/15 bg-background/95 backdrop-blur-md focus-within:border-foreground/25"
                value={input}
                onValueChange={setInput}
                onSubmit={handleSubmit}
            >
                {match({ editingMessageId, usagePercent, isPro })
                    .with(
                        {
                            usagePercent: P.number.gte(100),
                            isPro: false,
                            editingMessageId: P.nullish,
                        },
                        () => (
                            <div className="flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-3.5" />
                                    <p>Daily usage limit reached</p>
                                </div>
                                <Button
                                    variant="link"
                                    className="h-6 underline font-normal cursor-pointer px-0 text-xs"
                                    onClick={() => setProDialogOpen(true)}
                                >
                                    Upgrade for higher limits
                                </Button>
                            </div>
                        )
                    )
                    .with(
                        {
                            usagePercent: P.number.gte(80),
                            isPro: false,
                            editingMessageId: P.nullish,
                        },
                        () => (
                            <div className="flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-3.5" />
                                    <p>{usagePercent}% of daily usage used</p>
                                </div>
                                <Button
                                    variant="link"
                                    className="h-6 underline font-normal cursor-pointer px-0 text-xs"
                                    onClick={() => setProDialogOpen(true)}
                                >
                                    Upgrade for higher limits
                                </Button>
                            </div>
                        )
                    )
                    .with(
                        {
                            usagePercent: P.number.gte(80),
                            isPro: true,
                            editingMessageId: P.nullish,
                        },
                        () => (
                            <div className="flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-3.5" />
                                    <p>
                                        {usagePercent >= 100
                                            ? 'Daily usage limit reached'
                                            : `${usagePercent}% of daily usage used`}
                                    </p>
                                </div>
                                <p className="text-xs text-primary">Resets daily</p>
                            </div>
                        )
                    )
                    .with({ editingMessageId: P.string }, () => (
                        <div className="flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10">
                            <div className="flex items-center gap-2">
                                <EditIcon className="size-3.5" />
                                <p>Editing message</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                                onClick={() => {
                                    setEditingMessageId(undefined);
                                    setInput('');
                                    setAttachments([]);
                                }}
                            >
                                <XIcon className="size-3.5" />
                            </Button>
                        </div>
                    ))
                    .otherwise(() => null)}
                <div
                    className={cn('flex gap-2 px-4', {
                        'pt-4': attachments.length > 0 || pendingFileCount > 0,
                    })}
                >
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
                <PromptInputTextarea className="px-5 pt-4" placeholder="Write to the model…" />
                <PromptInputActions className="flex items-center px-3 pb-3 pt-1">
                    <ModelSelector />
                    <div className="flex-1" />
                    <PromptInputAction
                        tooltip={matcher
                            .with({ canModelViewFiles: true }, () => 'Attach files')
                            .with(
                                { canModelViewFiles: false },
                                () => 'This model does not support file uploads'
                            )
                            .otherwise(() => 'Attach files')}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                            onClick={handlePaperclipClick}
                            disabled={matcher
                                .with({ canModelViewFiles: false }, () => true)
                                .otherwise(() => false)}
                        >
                            <Paperclip className="size-4" />
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
                        tooltip={matcher
                            .with(
                                {
                                    input: P.string.maxLength(0),
                                    remainingBudget: P.number.gt(0),
                                    status: 'ready',
                                    canUseModel: true,
                                },
                                () => 'Message cannot be empty'
                            )
                            .with(
                                {
                                    remainingBudget: P.number.lte(0),
                                    status: 'ready',
                                },
                                () => 'You have reached your daily usage limit.'
                            )
                            .with(
                                {
                                    pendingFileCount: P.number.gt(0),
                                    status: 'ready',
                                },
                                () => 'Waiting for files to upload'
                            )
                            .with(
                                {
                                    attachments: P.when(a => a.length > 0),
                                    canModelViewFiles: false,
                                    status: 'ready',
                                },
                                () => 'This model does not support file uploads'
                            )
                            .with({ canUseModel: false, status: 'ready' }, () => cannotUseModelReason)
                            .with(
                                { status: P.union('streaming', 'submitted') },
                                () => 'Stop generation'
                            )
                            .otherwise(() => 'Send message')}
                    >
                        <Button
                            type="submit"
                            variant="default"
                            size="icon"
                            className="h-9 w-9 rounded-xl"
                            disabled={matcher
                                .with(
                                    {
                                        input: P.string.maxLength(0),
                                        remainingBudget: P.number.gt(0),
                                        status: 'ready',
                                    },
                                    () => true
                                )
                                .with(
                                    {
                                        remainingBudget: P.number.lte(0),
                                    },
                                    () => true
                                )
                                .with(
                                    {
                                        pendingFileCount: P.number.gt(0),
                                    },
                                    () => true
                                )
                                .with(
                                    {
                                        attachments: P.when(a => a.length > 0),
                                        canModelViewFiles: false,
                                        status: 'ready',
                                    },
                                    () => true
                                )
                                .with({ canUseModel: false, status: 'ready' }, () => true)
                                .with({ status: P.union('streaming', 'submitted') }, () => false)
                                .otherwise(() => false)}
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
        </motion.form>
    );
}
