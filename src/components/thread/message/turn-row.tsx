import {
    definePrimitive,
    Escape,
    HStack,
    Text,
    useMugenState,
    VStack,
} from '@wingleeio/mugen';
import {
    Markdown,
    defineMarkdownComponents,
    measureInline,
    type Font,
} from '@wingleeio/mugen-markdown';
import type { ReactNode } from 'react';
import { CopyIcon, EditIcon, FileTextIcon, GlobeIcon, Loader2Icon, RefreshCcwIcon } from 'lucide-react';
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

// ── Inline citation pills (mugen-markdown 0.4.1 inline-box override) ──────────
// A numbered citation link — `[1](https://…)` — renders as a measured inline
// pill that flows and wraps with the prose. The inline box reserves exactly its
// painted advance (measureInline + padding), so the analytic row height stays
// pixel-exact. The pill font is fixed so the width we reserve matches the paint.
const PILL_FONT = '600 11px Geist' as Font;
const PILL_PAD = 12; // 2 × 6px horizontal padding

function CitationPill({ label, href }: { label: string; href: string }): ReactNode {
    // A plain anchor: its box is exactly text + padding (no border/margin/width
    // to drift it), so the reserved advance matches what's painted. `title` is a
    // zero-layout native tooltip onto the source domain.
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={domainOf(href)}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                height: 16,
                padding: '0 6px',
                borderRadius: 5,
                textDecoration: 'none',
                font: PILL_FONT,
                lineHeight: '16px',
                background: 'color-mix(in oklab, var(--color-primary) 16%, transparent)',
                color: 'var(--color-primary)',
            }}
        >
            {label}
        </a>
    );
}

// Links whose visible text is just a number become measured citation pills;
// every other link stays a normal themed link. Tolerates the older bracketed
// `[[n]](url)` form (link text "[n]") as well as the plain `[n](url)` form.
const CHAT_COMPONENTS = defineMarkdownComponents({
    inline: {
        link: node => {
            const url = node.url ?? '';
            if (!url) return null;
            const text = node.children
                .map(child => (child.type === 'text' ? child.value : ''))
                .join('')
                .trim();
            const match = text.match(/^\[?(\d+)\]?$/);
            if (!match) return null;
            return [
                {
                    advance: measureInline(match[1], PILL_FONT) + PILL_PAD,
                    content: <CitationPill label={match[1]} href={url} />,
                },
            ];
        },
    },
});

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
    // Per-reasoning-block open state, keyed by block index; a missing entry
    // means "follow the stream" (open while reasoning, closed once done).
    // Toggling re-measures just this row.
    const [openMap, setOpenMap] = useMugenState<Record<number, boolean>>({});

    if (turn.role === 'user') {
        return <UserTurn turn={turn} />;
    }
    return <AssistantTurn turn={turn} openMap={openMap} setOpenMap={setOpenMap} />;
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
    openMap,
    setOpenMap,
}: {
    turn: Turn;
    openMap: Record<number, boolean>;
    setOpenMap: (next: Record<number, boolean>) => void;
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
                // The newest block of the streaming turn fades appended text in
                // via <Markdown fade> — the row never animates, heights stay exact.
                const fading = turn.streaming && i === turn.blocks.length - 1;

                if (block.kind === 'reasoning') {
                    const open = openMap[i] ?? !block.done;
                    const label = block.done
                        ? `Thought${block.seconds ? ` for ${block.seconds}s` : ''}`
                        : 'Thinking…';
                    return (
                        <VStack key={i} gap={open ? 10 : 0}>
                            <Disclosure
                                padding={2}
                                onClick={() => setOpenMap({ ...openMap, [i]: !open })}
                                style={{ ...buttonReset, borderRadius: 6 }}
                            >
                                <Text font={`500 12px ${MONO}`} lineHeight={16} color={INK.muted}>
                                    {label}
                                </Text>
                            </Disclosure>
                            {open ? (
                                <HStack gap={13} align="stretch">
                                    <VStack
                                        width={2}
                                        style={{ background: INK.hairline, borderRadius: 2 }}
                                    />
                                    <VStack gap={10}>
                                        <Markdown
                                            source={block.text}
                                            theme={REASONING_MD_THEME}
                                            fade={fading && !block.done}
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

                if (block.kind === 'tool-search') {
                    return (
                        <Escape key={i} height={40}>
                            <ToolCard
                                icon={<GlobeIcon className="size-3.5" />}
                                label={block.status === 'running' ? 'Searching the web' : 'Searched the web'}
                                detail={block.query}
                                meta={
                                    block.sources.length > 0
                                        ? `${block.sources.length} result${block.sources.length === 1 ? '' : 's'}`
                                        : undefined
                                }
                                running={block.status === 'running'}
                            />
                        </Escape>
                    );
                }

                if (block.kind === 'tool-read') {
                    return (
                        <Escape key={i} height={40}>
                            <ToolCard
                                icon={<FileTextIcon className="size-3.5" />}
                                label={block.status === 'running' ? 'Reading' : 'Read'}
                                detail={block.title || domainOf(block.url)}
                                meta={domainOf(block.url)}
                                running={block.status === 'running'}
                            />
                        </Escape>
                    );
                }

                return (
                    <Markdown
                        key={i}
                        source={block.text}
                        theme={CHAT_MD_THEME}
                        components={CHAT_COMPONENTS}
                        fade={fading}
                    />
                );
            })}

            {!turn.streaming && turn.sources.length > 0 ? (
                <Escape height={SOURCES_TOP_PAD + SOURCES_HEADER_H + turn.sources.length * SOURCE_ROW_H}>
                    <SourcesFooter sources={turn.sources} />
                </Escape>
            ) : null}

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

// ── Web-tool cards + sources footer — normal React inside an Escape with a
//    declared height, so the walker measures them exactly without inspecting
//    their contents. ──

const SOURCES_TOP_PAD = 12;
const SOURCES_HEADER_H = 22;
const SOURCE_ROW_H = 30;

function domainOf(url?: string): string {
    if (!url) return '';
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

function faviconOf(url: string): string {
    return `https://www.google.com/s2/favicons?domain=${domainOf(url)}&sz=64`;
}

function ToolCard({
    icon,
    label,
    detail,
    meta,
    running,
}: {
    icon: ReactNode;
    label: string;
    detail?: string;
    meta?: string;
    running?: boolean;
}): ReactNode {
    return (
        <div className="flex h-full items-center">
            <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-foreground/8 bg-foreground/[0.04] px-3 text-muted-foreground">
                {running ? <Loader2Icon className="size-3.5 animate-spin shrink-0" /> : icon}
                <span className="shrink-0 text-xs font-medium text-foreground/80">{label}</span>
                {detail ? (
                    <span className="truncate text-xs text-muted-foreground">{detail}</span>
                ) : null}
                {meta ? (
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">
                        {meta}
                    </span>
                ) : null}
            </div>
        </div>
    );
}

function SourcesFooter({ sources }: { sources: { url: string; title?: string }[] }): ReactNode {
    return (
        <div style={{ paddingTop: SOURCES_TOP_PAD }}>
            <div
                style={{ height: SOURCES_HEADER_H }}
                className="flex items-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60"
            >
                Sources
            </div>
            {sources.map((source, i) => (
                <a
                    key={`${source.url}-${i}`}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ height: SOURCE_ROW_H }}
                    className="group/source flex items-center gap-2.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <span className="flex size-5 shrink-0 items-center justify-center font-mono text-[10px] text-muted-foreground/60">
                        {i + 1}
                    </span>
                    <img
                        src={faviconOf(source.url)}
                        alt=""
                        className="size-4 shrink-0 rounded-sm"
                        onError={e => {
                            e.currentTarget.style.visibility = 'hidden';
                        }}
                    />
                    <span className="min-w-0 flex-1 truncate text-foreground/80 group-hover/source:text-foreground">
                        {source.title || domainOf(source.url)}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground/60">
                        {domainOf(source.url)}
                    </span>
                </a>
            ))}
        </div>
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
