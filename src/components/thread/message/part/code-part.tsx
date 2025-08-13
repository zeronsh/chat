import { CodeBlock, CodeBlockCode } from '@/components/ui/code-block';
import { usePart, useThreadSelector } from '@/context/thread';
import { cn } from '@/lib/utils';

import { memo, useMemo } from 'react';

export const CodePart = memo(function PureCodePart({ id, index }: { id: string; index: number }) {
    const codePart = usePart({
        id,
        index,
        type: 'tool-code',
        selector: part => part,
    });

    const codeFromDelta = useThreadSelector(state => {
        return state.messageMap[id].parts
            .filter(part => part.type === 'data-code-delta')
            .filter(part => part.data.toolCallId === codePart.toolCallId)
            .map(part => {
                return part.data.delta;
            })
            .join('');
    });

    const code = codePart.output?.code ?? codeFromDelta ?? '';

    const { stdout, stderr, images } = useMemo(() => {
        const exec = codePart.output?.results as any;
        const out: string = exec?.logs?.stdout?.join?.('\n') ?? '';
        const err: string = exec?.logs?.stderr?.join?.('\n') ?? '';
        const imgs: string[] = Array.isArray(exec?.results)
            ? exec.results
                  .map((r: any) => r?.png)
                  .filter((p: unknown): p is string => typeof p === 'string' && p.length > 0)
            : [];
        return { stdout: out, stderr: err, images: imgs };
    }, [codePart.output]);

    return (
        <div className={cn('w-full')}>
            <CodeBlock>
                <CodeBlockCode code={code} language="python" />
            </CodeBlock>

            {(stdout || stderr) && (
                <div className="mt-2 flex flex-col gap-2">
                    {stdout && (
                        <CodeBlock>
                            <CodeBlockCode code={stdout} language="terminal" />
                        </CodeBlock>
                    )}
                    {stderr && (
                        <CodeBlock>
                            <CodeBlockCode code={stderr} language="stderr" />
                        </CodeBlock>
                    )}
                </div>
            )}

            {images.length > 0 && (
                <div className="mt-2 grid gap-2">
                    {images.map((png, i) => (
                        <img
                            key={i}
                            src={`data:image/png;base64,${png}`}
                            alt="Execution output"
                            className="w-full rounded-lg border"
                        />
                    ))}
                </div>
            )}
        </div>
    );
});
