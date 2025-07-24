import { CodeBlock, CodeBlockCode } from '@/components/ui/code-block';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import { createContext, memo, useContext, useId, useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export type MarkdownProps = {
    children: string;
    id?: string;
    className?: string;
    components?: Partial<Components>;
};

interface CitationSourceConfig {
    name: string;
    pattern: RegExp;
    urlGenerator: (title: string, source: string) => string | null;
}

const citationSources: CitationSourceConfig[] = [
    {
        name: 'Wikipedia',
        pattern: /Wikipedia/i,
        urlGenerator: (title: string, source: string) => {
            const searchTerm = `${title} ${source.replace(/\s+[-–—]\s+Wikipedia/i, '')}`.trim();
            return `https://en.wikipedia.org/wiki/${encodeURIComponent(
                searchTerm.replace(/\s+/g, '_')
            )}`;
        },
    },
    {
        name: 'arXiv',
        pattern: /arXiv:(\d+\.\d+)/i,
        urlGenerator: (_: string, source: string) => {
            const match = source.match(/arXiv:(\d+\.\d+)/i);
            return match ? `https://arxiv.org/abs/${match[1]}` : null;
        },
    },
    {
        name: 'GitHub',
        pattern: /github\.com\/[^\/]+\/[^\/\s]+/i,
        urlGenerator: (_: string, source: string) => {
            const match = source.match(/(https?:\/\/github\.com\/[^\/]+\/[^\/\s]+)/i);
            return match ? match[1] : null;
        },
    },
    {
        name: 'DOI',
        pattern: /doi:(\S+)/i,
        urlGenerator: (_: string, source: string) => {
            const match = source.match(/doi:(\S+)/i);
            return match ? `https://doi.org/${match[1]}` : null;
        },
    },
];

const processCitation = (title: string, source: string): { text: string; url: string } | null => {
    for (const citationSource of citationSources) {
        if (citationSource.pattern.test(source)) {
            const url = citationSource.urlGenerator(title, source);
            if (url) {
                return {
                    text: `${title} - ${source}`,
                    url,
                };
            }
        }
    }
    return null;
};

function extractLanguage(className?: string): string {
    if (!className) return 'plaintext';
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : 'plaintext';
}

function extractDomain(url: string | undefined): string {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, '');
    } catch {
        // If URL parsing fails, try to extract domain manually
        const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
        return match ? match[1] : url;
    }
}

const INITIAL_COMPONENTS: Partial<Components> = {
    code: function CodeComponent({ className, children, ...props }) {
        const isInline =
            !props.node?.position?.start.line ||
            props.node?.position?.start.line === props.node?.position?.end.line;

        if (isInline) {
            return (
                <span
                    className={cn('bg-muted rounded-sm px-1 font-mono text-sm', className)}
                    {...props}
                >
                    {children}
                </span>
            );
        }

        const language = extractLanguage(className);

        return (
            <CodeBlock className={className}>
                <CodeBlockCode code={children as string} language={language} />
            </CodeBlock>
        );
    },
    pre: function PreComponent({ children }) {
        return <>{children}</>;
    },
    a: function LinkComponent({ children, href, ...props }) {
        const { citations } = useMarkdownContext();
        const citationIndex = citations.findIndex(citation => citation.link === href);
        const { ref, ...anchorProps } = props;

        if (citationIndex !== -1) {
            const domain = extractDomain(href);
            return (
                <Tooltip>
                    <TooltipTrigger>
                        <a
                            href={href}
                            {...anchorProps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-muted rounded-xl px-1 flex items-center no-underline"
                        >
                            {domain || citationIndex + 1}
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>{citations[citationIndex].text}</TooltipContent>
                </Tooltip>
            );
        }
        return (
            <a href={href} {...anchorProps} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    },
};

const MemoizedMarkdownBlock = memo(
    function MarkdownBlock({
        content,
        components = INITIAL_COMPONENTS,
    }: {
        content: string;
        components?: Partial<Components>;
    }) {
        return (
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
                {content}
            </ReactMarkdown>
        );
    },
    function propsAreEqual(prevProps, nextProps) {
        return prevProps.content === nextProps.content;
    }
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

type MarkdownContextType = {
    citations: { text: string; link: string }[];
};

const MarkdownContext = createContext<MarkdownContextType | null>(null);

const useMarkdownContext = () => {
    const context = useContext(MarkdownContext);
    if (!context) {
        throw new Error('useMarkdownContext must be used within a MarkdownProvider');
    }
    return context;
};

function MarkdownComponent({
    children,
    className,
    components = INITIAL_COMPONENTS,
}: MarkdownProps) {
    const citations = useMemo(() => {
        const citations: { text: string; link: string }[] = [];

        const stdLinkRegex = /\[([^\]]+)\]\(((?:\([^()]*\)|[^()])*)\)/g;
        children = children.replace(stdLinkRegex, (_, text, url) => {
            citations.push({ text, link: url });
            return `[${text}](${url})`;
        });

        const refWithUrlRegex =
            /(?:\[(?:(?:\[?(PDF|DOC|HTML)\]?\s+)?([^\]]+))\]|\b([^.!?\n]+?(?:\s+[-–—]\s+\w+|\s+\([^)]+\)))\b)(?:\s*(?:\(|\[\s*|\s+))(https?:\/\/[^\s)]+)(?:\s*[)\]]|\s|$)/g;
        children = children.replace(refWithUrlRegex, (_, docType, bracketText, plainText, url) => {
            const text = bracketText || plainText;
            const fullText = (docType ? `[${docType}] ` : '') + text;
            const cleanUrl = url.replace(/[.,;:]+$/, '');

            citations.push({ text: fullText.trim(), link: cleanUrl });
            return `[${fullText.trim()}](${cleanUrl})`;
        });

        const quotedTitleRegex =
            /"([^"]+)"(?:\s+([^.!?\n]+?)(?:\s+[-–—]\s+(?:[A-Z][a-z]+(?:\.[a-z]+)?|\w+:\S+)))/g;
        children = children.replace(quotedTitleRegex, (match, title, source) => {
            const citation = processCitation(title, source);
            if (citation) {
                citations.push({ text: citation.text.trim(), link: citation.url });
                return `[${citation.text.trim()}](${citation.url})`;
            }
            return match;
        });

        const rawUrlRegex = /(https?:\/\/[^\s]+\.(?:pdf|doc|docx|ppt|pptx|xls|xlsx))\b/gi;
        children = children.replace(rawUrlRegex, (match, url) => {
            const filename = url.split('/').pop() || url;
            const alreadyLinked = citations.some(citation => citation.link === url);
            if (!alreadyLinked) {
                citations.push({ text: filename, link: url });
            }
            return match;
        });

        return citations.filter(citation => citation.link !== citation.text);
    }, [children]);

    return (
        <MarkdownContext.Provider value={{ citations }}>
            <div className={className}>
                <MemoizedMarkdownBlock content={children} components={components} />
            </div>
        </MarkdownContext.Provider>
    );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = 'Markdown';

export { Markdown };
