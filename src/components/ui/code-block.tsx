import { Button } from '@/components/ui/button';
import { useCodeHighlighter } from '@/hooks/use-code-highlighter';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { memo, useState } from 'react';

export type CodeBlockProps = {
    children?: React.ReactNode;
    className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
    return (
        <div
            className={cn(
                'not-prose flex w-full flex-col overflow-clip border',
                'border-border bg-card text-card-foreground rounded-xl',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export type CodeBlockCodeProps = {
    code: string;
    language?: string;
    theme?: string;
    className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlockCode({
    code,
    language = 'tsx',
    theme = 'css-variables',
    className,
    ...props
}: CodeBlockCodeProps) {
    const [isCopied, setIsCopied] = useState(false);

    const lines = code.split('\n');

    function handleCopy() {
        if (isCopied) return;
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }

    const classNames = cn(
        'w-full overflow-x-auto text-[13px] [&>pre]:px-4 [&>pre]:py-4 shadow-xl',
        className
    );

    return (
        <div className="relative">
            <div className="flex gap-2 items-center border-b justify-between p-2">
                <div className="text-sm text-muted-foreground">{language}</div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="rounded-lg h-6 w-6 hover:bg-sidebar/50"
                >
                    {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
            </div>

            <div className={classNames} {...props}>
                {lines.map((line, index) => (
                    <CodeBlockLine key={index} line={line} language={language} />
                ))}
            </div>
        </div>
    );
}

const CodeBlockLine = memo(
    function CodeBlockLine({ line, language }: { line: string; language: string }) {
        const { highlightedCode } = useCodeHighlighter({
            codeString: line,
            language,
            shouldHighlight: true,
        });

        if (!line.trim()) {
            return <pre className="px-4" />;
        }

        if (!highlightedCode) {
            return <pre className="px-4 py-0!">{line}</pre>;
        }

        return <div className="px-4" dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
    },
    (prevProps, nextProps) => prevProps.line === nextProps.line
);

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

function CodeBlockGroup({ children, className, ...props }: CodeBlockGroupProps) {
    return (
        <div className={cn('flex items-center justify-between', className)} {...props}>
            {children}
        </div>
    );
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock };
