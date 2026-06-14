import {
    definePrimitive,
    Escape,
    HStack,
    Text,
    useMugenState,
    VStack,
} from '@wingleeio/mugen';
import { Markdown } from '@wingleeio/mugen-markdown';
import { STREAM_FADE_CLASS } from '@/components/thread/stream-fade';
import type { ReactNode } from 'react';
import { CopyIcon, EditIcon, RefreshCcwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FileAttachment } from '@/components/thread/file-attachment';
import ModelIcon, { type ModelType } from '@/components/thread/model-icon';
import { useThreadContext, useThreadSelector } from '@/context/thread';
import type { Turn } from '@/components/thread/turns';

const SANS = 'Geist, sans-serif';
const MONO = "'Geist Mono', monospace";

const INK = {
    fg: 'var(--color-foreground)',
    muted: 'var(--color-muted-foreground)',
    accent: 'var(--color-primary)',
    card: 'var(--color-card)',
    hairline: 'color-mix(in oklab, var(--color-foreground) 12%, transparent)',
    wash: 'color-mix(in oklab, var(--color-foreground) 5%, transparent)',
} as const;

// Markdown typeset for the assistant voice — measured by the walker, themed
// through the same CSS variables as the rest of the app.
const CHAT_MD_THEME = {
    fontFamily: 'Geist',
    monoFamily: "'Geist Mono', monospace",
    fontSize: 15,
    lineHeight: 26,
    color: INK.fg,
    blockGap: 14,
    heading: { color: INK.fg, weight: 600 },
    link: { color: INK.accent, underline: true },
    inlineCode: { background: INK.wash, color: INK.fg, sizeScale: 0.9 },
    code: {
        background: INK.wash,
        color: INK.fg,
        padding: 14,
        radius: 8,
        fontSize: 13,
        lineHeight: 21,
        // Chrome bar with the language label + copy button. Its height is
        // folded into the measured height, so heights stay exact.
        header: {
            show: true,
            height: 36,
            fontSize: 12,
            background: 'color-mix(in oklab, var(--color-foreground) 8%, transparent)',
            color: INK.muted,
            borderColor: INK.hairline,
            buttonBackground: INK.wash,
        },
    },
    blockquote: { borderColor: INK.hairline, color: INK.muted, padding: 12, gap: 8, borderWidth: 2 },
    list: { gap: 8, indent: 22, markerColor: INK.muted },
} as const;

// The reasoning trace is markdown too — same typesetting, muted and a step
// smaller so it reads as an aside.
const REASONING_MD_THEME = {
    fontFamily: 'Geist',
    monoFamily: "'Geist Mono', monospace",
    fontSize: 14,
    lineHeight: 24,
    color: INK.muted,
    blockGap: 10,
    heading: { color: INK.muted, weight: 600 },
    link: { color: INK.accent, underline: true },
    inlineCode: { background: INK.wash, color: INK.muted, sizeScale: 0.9 },
    code: {
        background: INK.wash,
        color: INK.muted,
        padding: 12,
        radius: 8,
        fontSize: 12.5,
        lineHeight: 19,
    },
    blockquote: { borderColor: INK.hairline, color: INK.muted, padding: 10, gap: 8, borderWidth: 2 },
    list: { gap: 6, indent: 20, markerColor: INK.muted },
} as const;

/** Clickable disclosure header for the reasoning trace (a real <button>). */
const Disclosure = definePrimitive('button', { name: 'Disclosure' });

const buttonReset = {
    cursor: 'pointer',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    font: 'inherit',
    color: 'inherit',
} as const;

export function TurnRow(turn: Turn): ReactNode {
    // Mugen hooks may only be called directly inside the render function, so
    // per-row state lives here and flows into the (hook-free) turn components.
    // One disclosure per turn; null means "follow the stream" (open while
    // reasoning, closed once done). Toggling re-measures just this row.
    const [openOverride, setOpenOverride] = useMugenState<boolean | null>(null);

    if (turn.role === 'user') {
        return <UserTurn turn={turn} />;
    }
    return (
        <AssistantTurn
            turn={turn}
            openOverride={openOverride}
            setOpenOverride={setOpenOverride}
        />
    );
}

function UserTurn({ turn }: { turn: Turn }): ReactNode {
    return (
        <VStack gap={8} padding={16} className="group">

            {turn.files.length > 0 ? (
                <HStack justify="flex-end">
                    <Escape height={100}>
                        <div className="flex h-full items-center justify-end gap-2">
                            {turn.files.map((file, i) => (
                                <FileAttachment
                                    key={i}
                                    url={file.url}
                                    name={file.filename}
                                    mediaType={file.mediaType}
                                />
                            ))}
                        </div>
                    </Escape>
                </HStack>
            ) : null}
            <HStack justify="flex-end">
                <VStack
                    padding={14}
                    style={{
                        background: 'var(--color-foreground)',
                        borderRadius: '18px 18px 4px 18px',
                    }}
                >
                    <Text
                        shrink
                        whiteSpace="pre-wrap"
                        font={`15px ${SANS}`}
                        lineHeight={24}
                        color="var(--color-background)"
                    >
                        {turn.text}
                    </Text>
                </VStack>
            </HStack>
            <HStack justify="flex-end">
                <Escape height={28} width={64}>
                    <UserActions turn={turn} />
                </Escape>
            </HStack>
        </VStack>
    );
}

function AssistantTurn({
    turn,
    openOverride,
    setOpenOverride,
}: {
    turn: Turn;
    openOverride: boolean | null;
    setOpenOverride: (open: boolean | null) => void;
}): ReactNode {
    return (
        <VStack gap={14} padding={16} className="group">
            {turn.pending ? (
                <Text
                    font={`600 15px ${SANS}`}
                    lineHeight={26}
                    color={INK.accent}
                    className="animate-pulse"
                >
                    ▍
                </Text>
            ) : null}

            {turn.blocks.map((block, i) => {
                // The newest block of the streaming turn gets the marker class
                // the StreamFadeOverlay veils — appended text fades in without
                // the row ever animating.
                const fading = turn.streaming && i === turn.blocks.length - 1;

                if (block.kind === 'reasoning') {
                    const open = openOverride ?? !block.done;
                    const label = block.done
                        ? `Thought${block.seconds ? ` for ${block.seconds}s` : ''}`
                        : 'Thinking…';
                    return (
                        <VStack key={i} gap={open ? 10 : 0}>
                            <Disclosure
                                padding={2}
                                onClick={() => setOpenOverride(!open)}
                                style={{ ...buttonReset, borderRadius: 6 }}
                            >
                                <Text font={`500 12px ${MONO}`} lineHeight={16} color={INK.muted}>
                                    {label}
                                </Text>
                            </Disclosure>
                            {open ? (
                                <HStack
                                    gap={13}
                                    align="stretch"
                                    className={fading && !block.done ? STREAM_FADE_CLASS : undefined}
                                >
                                    <VStack
                                        width={2}
                                        style={{ background: INK.hairline, borderRadius: 2 }}
                                    />
                                    <VStack gap={10}>
                                        <Markdown
                                            source={block.text}
                                            theme={REASONING_MD_THEME}
                                        />
                                    </VStack>
                                </HStack>
                            ) : null}
                        </VStack>
                    );
                }

                if (block.kind === 'error') {
                    return (
                        <HStack key={i} gap={13} align="stretch">
                            <VStack
                                width={2}
                                style={{ background: 'var(--color-destructive)', borderRadius: 2 }}
                            />
                            <Text
                                font={`13px ${MONO}`}
                                lineHeight={20}
                                color="var(--color-destructive)"
                            >
                                {block.text}
                            </Text>
                        </HStack>
                    );
                }

                return (
                    <VStack key={i} className={fading ? STREAM_FADE_CLASS : undefined}>
                        <Markdown source={block.text} theme={CHAT_MD_THEME} />
                    </VStack>
                );
            })}

            {turn.streaming && !turn.pending ? (
                <Text
                    font={`600 15px ${SANS}`}
                    lineHeight={26}
                    color={INK.accent}
                    className="animate-pulse"
                >
                    ▍
                </Text>
            ) : null}

            {!turn.streaming ? (
                <Escape height={28}>
                    <AssistantActions turn={turn} />
                </Escape>
            ) : null}
        </VStack>
    );
}

// ── Action clusters — arbitrary React inside an Escape; the walker never
//    looks inside, so context, tooltips, and toasts all work normally. ──

function UserActions({ turn }: { turn: Turn }): ReactNode {
    const setEditingMessageId = useThreadSelector(state => state.setEditingMessageId);
    const setInput = useThreadSelector(state => state.setInput);
    const setAttachments = useThreadSelector(state => state.setAttachments);

    return (
        <div className="flex h-full items-center justify-end gap-0.5 opacity-100 transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100">
            <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Copy message"
                onClick={async () => {
                    await navigator.clipboard.writeText(turn.text);
                    toast.success('Copied to clipboard');
                }}
            >
                <CopyIcon className="size-3" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Edit message"
                onClick={() => {
                    setEditingMessageId(turn.messageId);
                    setInput(turn.text);
                    setAttachments(
                        turn.files.map(file => ({
                            type: 'file' as const,
                            url: file.url,
                            filename: file.filename || 'untitled',
                            mediaType: file.mediaType,
                        }))
                    );
                }}
            >
                <EditIcon className="size-3" />
            </Button>
        </div>
    );
}

function AssistantActions({ turn }: { turn: Turn }): ReactNode {
    const thread = useThreadContext();
    const busy = useThreadSelector(
        state => state.status === 'streaming' || state.status === 'submitted'
    );

    return (
        <div className="flex h-full items-center gap-0.5 opacity-100 transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100">
            <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Copy response"
                onClick={async () => {
                    await navigator.clipboard.writeText(turn.text);
                    toast.success('Copied to clipboard');
                }}
            >
                <CopyIcon className="size-3" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Regenerate response"
                disabled={busy}
                onClick={() => {
                    thread.regenerate({ messageId: turn.messageId });
                }}
            >
                <RefreshCcwIcon className="size-3" />
            </Button>
            {turn.modelName ? (
                <span className="ml-1 flex items-center gap-1.5 text-muted-foreground">
                    {turn.modelIcon ? (
                        <ModelIcon
                            className="size-3 fill-current"
                            model={turn.modelIcon as ModelType}
                        />
                    ) : null}
                    <span className="text-xs">{turn.modelName}</span>
                </span>
            ) : null}
        </div>
    );
}
