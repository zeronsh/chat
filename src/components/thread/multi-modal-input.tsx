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
    EditIcon,
    XIcon,
    AlertTriangleIcon,
    MessageCircleIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from '@tanstack/react-router';
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
import { ScrollToBottomButton } from '@/components/thread/scroll-to-bottom-button';
import { dialogStore } from '@/stores/dialogs';

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
    const setEditingMessageId = useThreadSelector(state => state.setEditingMessageId);
    const editingMessageId = useThreadSelector(state => state.editingMessageId);
    const setMessages = useThreadSelector(state => state.setMessages);
    const setProDialogOpen = dialogStore(store => store.proDialog.setOpen);
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
        if (!input.trim()) return;

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

        sendMessage(
            {
                id: editingMessageId,
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
        setEditingMessageId(undefined);
    };

    const {
        isPro,
        isExpiring,
        remainingCredits,
        remainingSearches,
        remainingResearches,
        canSearch,
        canResearch,
        canUseModel,
        cannotUseModelReason,
        canModelUseTools,
        canModelViewFiles,
    } = useAccess();

    const matcher = useMemo(() => {
        return match({
            isPro,
            isExpiring,
            remainingCredits,
            remainingSearches,
            remainingResearches,
            canSearch,
            canResearch,
            status,
            attachments,
            tool,
            input,
            pendingFileCount,
            canUseModel,
            canModelUseTools,
            canModelViewFiles,
        });
    }, [
        isPro,
        isExpiring,
        remainingCredits,
        remainingSearches,
        remainingResearches,
        canSearch,
        canResearch,
        status,
        attachments,
        tool,
        input,
        pendingFileCount,
        canUseModel,
        canModelUseTools,
        canModelViewFiles,
    ]);

    useEffect(() => {
        if (!canModelUseTools) {
            setTool('');
        }
    }, [canModelUseTools]);

    return (
        <form
            className={cn({
                'absolute px-4 pt-4 flex flex-col gap-4': true,
                'bottom-0 left-0 right-0': true,
            })}
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
            <ScrollToBottomButton variant="default" />
            <PromptInput
                className="max-w-3xl mx-auto p-0 bg-muted/50 backdrop-blur-md w-full border-foreground/10 overflow-hidden"
                value={input}
                onValueChange={setInput}
                onSubmit={handleSubmit}
            >
                {match({ editingMessageId, remainingCredits, isPro })
                    .with(
                        {
                            remainingCredits: P.number.lte(0),
                            isPro: false,
                            editingMessageId: P.nullish,
                        },
                        () => (
                            <div className="flex justify-between items-center px-3 py-3 bg-sidebar/30 backdrop-blur-md text-xs text-muted-foreground border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-4 " />
                                    <p>You have no credits remaining.</p>
                                </div>
                                <Button
                                    variant="link"
                                    className="h-6 underline font-normal cursor-pointer px-0 text-xs"
                                    onClick={() => setProDialogOpen(true)}
                                >
                                    Subscribe now to increase your limits
                                </Button>
                            </div>
                        )
                    )
                    .with(
                        {
                            remainingCredits: P.number.lt(10),
                            isPro: false,
                            editingMessageId: P.nullish,
                        },
                        () => (
                            <div className="flex justify-between items-center px-3 py-3 bg-sidebar/30 backdrop-blur-md text-xs text-muted-foreground border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-4 " />
                                    <p>
                                        You only have {remainingCredits} credit
                                        {remainingCredits === 1 ? '' : 's'} remaining.
                                    </p>
                                </div>
                                <Button
                                    variant="link"
                                    className="h-6 underline font-normal cursor-pointer px-0 text-xs"
                                    onClick={() => setProDialogOpen(true)}
                                >
                                    Subscribe now to increase your limits
                                </Button>
                            </div>
                        )
                    )
                    .with(
                        {
                            remainingCredits: P.number.lte(0),
                            isPro: true,
                            editingMessageId: P.nullish,
                        },
                        () => (
                            <div className="flex justify-between items-center px-3 py-3 bg-sidebar/30 backdrop-blur-md text-xs text-muted-foreground border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-4 " />
                                    <p>You have no credits remaining.</p>
                                </div>
                                <p className="text-xs text-primary">Resets daily</p>
                            </div>
                        )
                    )
                    .with(
                        {
                            remainingCredits: P.number.lt(10),
                            isPro: true,
                            editingMessageId: P.nullish,
                        },
                        () => (
                            <div className="flex justify-between items-center px-3 py-3 bg-sidebar/30 backdrop-blur-md text-xs text-muted-foreground border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-4 " />
                                    <p>
                                        You only have {remainingCredits} credit
                                        {remainingCredits === 1 ? '' : 's'} remaining.
                                    </p>
                                </div>
                                <p className="text-xs text-primary">Resets daily</p>
                            </div>
                        )
                    )
                    .with({ editingMessageId: P.string }, () => (
                        <div className="flex justify-between items-center px-3 py-3 bg-sidebar/30 backdrop-blur-md text-xs text-muted-foreground border-b border-foreground/10">
                            <div className="flex items-center gap-2">
                                <EditIcon className="size-4" />
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
                                    setTool('');
                                }}
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>
                    ))
                    .otherwise(() => null)}
                <div className="flex gap-2 px-3 pt-3">
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
                <PromptInputTextarea className="px-6" placeholder="Ask me anything..." />
                <PromptInputActions className="flex items-center px-3 pb-3">
                    {/* Switch-like tool selector */}
                    <div className="flex items-center bg-muted rounded-full p-1 relative h-10">
                        {/* Chat icon - default tab */}
                        <PromptInputAction tooltip="Chat">
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className={cn(
                                    'h-8 w-8 rounded-full relative z-10 hover:text-primary',
                                    tool === '' && 'text-primary'
                                )}
                                onClick={() => setTool('')}
                            >
                                <MessageCircleIcon className="size-4 z-1" />
                                {tool === '' && (
                                    <motion.div
                                        className="absolute inset-0 h-8 w-full rounded-full bg-background z-0"
                                        layoutId="toolThumb"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Button>
                        </PromptInputAction>

                        {/* Search icon */}
                        <PromptInputAction
                            tooltip={matcher
                                .with(
                                    { canSearch: true, canModelUseTools: true },
                                    () => 'Search the web'
                                )
                                .with(
                                    { canModelUseTools: false },
                                    () => 'This model cannot use tools'
                                )
                                .with(
                                    {
                                        remainingSearches: P.number.lte(0),
                                    },
                                    () => 'You have reached your search limit'
                                )
                                .otherwise(() => 'Search is not available')}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className={cn(
                                    'h-8 w-8 rounded-full relative z-10 hover:text-primary',
                                    tool === 'search' && 'text-primary',
                                    matcher
                                        .with({ canSearch: false }, () => 'opacity-50')
                                        .with({ canModelUseTools: false }, () => 'opacity-50')
                                        .otherwise(() => null)
                                )}
                                onClick={() => {
                                    matcher
                                        .with({ canSearch: true, canModelUseTools: true }, () => {
                                            setTool('search');
                                        })
                                        .with({ canModelUseTools: false }, () => {
                                            toast('This model cannot use tools');
                                        })
                                        .with(
                                            {
                                                remainingSearches: P.number.lte(0),
                                            },
                                            () => {
                                                toast('You have reached your search limit');
                                            }
                                        )
                                        .otherwise(() => {
                                            toast('Search is not available');
                                        });
                                }}
                            >
                                <GlobeIcon className="size-4 z-1" />
                                {tool === 'search' && (
                                    <motion.div
                                        className="absolute inset-0 h-8 w-full rounded-full bg-background"
                                        layoutId="toolThumb"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Button>
                        </PromptInputAction>

                        {/* Research icon */}
                        <PromptInputAction
                            tooltip={matcher
                                .with(
                                    { canResearch: true, canModelUseTools: true },
                                    () => 'Deep research'
                                )
                                .with(
                                    {
                                        isPro: true,
                                        remainingResearches: P.number.lte(0),
                                    },
                                    () => 'You have reached your research limit'
                                )
                                .with(
                                    { isPro: false },
                                    () => 'Research is only available for Pro users'
                                )
                                .with(
                                    { canModelUseTools: false },
                                    () => 'This model cannot use tools'
                                )
                                .otherwise(() => 'Deep research is not available')}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className={cn(
                                    'h-8 w-16 rounded-full relative z-10 hover:text-primary',
                                    tool === 'research' && 'text-primary',
                                    matcher
                                        .with({ canResearch: false }, () => 'opacity-50')
                                        .with({ canModelUseTools: false }, () => 'opacity-50')
                                        .otherwise(() => null)
                                )}
                                onClick={() => {
                                    matcher
                                        .with({ canResearch: true, canModelUseTools: true }, () => {
                                            setTool('research');
                                        })
                                        .with(
                                            {
                                                isPro: true,
                                                remainingResearches: P.number.lte(0),
                                            },
                                            () => {
                                                toast('You have reached your research limit');
                                            }
                                        )
                                        .with({ canModelUseTools: false }, () => {
                                            toast('This model cannot use tools');
                                        })
                                        .with({ isPro: false }, () => {
                                            setProDialogOpen(true);
                                        })
                                        .otherwise(() => null);
                                }}
                            >
                                <div className="flex items-center gap-1">
                                    <TelescopeIcon className="size-4 z-1" />
                                    <span className="text-[8px] font-medium text-primary px-1 py-0.5 rounded-full z-1 bg-primary/10">
                                        BETA
                                    </span>
                                </div>
                                {tool === 'research' && (
                                    <motion.div
                                        className="absolute inset-0 h-8 w-full rounded-full bg-background"
                                        layoutId="toolThumb"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Button>
                        </PromptInputAction>
                    </div>
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
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            type="button"
                            onClick={handlePaperclipClick}
                            disabled={matcher
                                .with({ canModelViewFiles: false }, () => true)
                                .otherwise(() => false)}
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
                        tooltip={matcher
                            .with(
                                {
                                    input: P.string.maxLength(0),
                                    remainingCredits: P.number.gt(0),
                                    status: 'ready',
                                    canUseModel: true,
                                },
                                () => 'Message cannot be empty'
                            )
                            .with(
                                {
                                    remainingCredits: 0,
                                    status: 'ready',
                                },
                                () => 'You have reached your message limit.'
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
                            .with(
                                { canUseModel: false, status: 'ready' },
                                () => cannotUseModelReason
                            )
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
                            className="h-8 w-8 rounded-full"
                            disabled={matcher
                                .with(
                                    {
                                        input: P.string.maxLength(0),
                                        remainingCredits: P.number.gt(0),
                                        status: 'ready',
                                    },
                                    () => true
                                )
                                .with(
                                    {
                                        remainingCredits: 0,
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
