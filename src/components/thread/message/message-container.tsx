import { useThreadSelector } from '@/context/thread';
import { useAccess } from '@/hooks/use-access';
import { cn } from '@/lib/utils';
import { match, P } from 'ts-pattern';

export function MessageContainer({
    children,
    hasPreviousMessage,
    hasNextMessage,
    className,
}: {
    children: React.ReactNode;
    hasPreviousMessage: boolean;
    hasNextMessage: boolean;
    className?: string;
}) {
    const editingMessageId = useThreadSelector(state => state.editingMessageId);
    const { isPro, usagePercent } = useAccess();

    return (
        <div
            className={cn(
                'flex w-full max-w-3xl mx-auto px-4',
                className,
                !hasPreviousMessage && 'pt-40',
                !hasNextMessage &&
                    match({ editingMessageId, usagePercent, isPro })
                        .with(
                            {
                                usagePercent: P.number.gte(100),
                                isPro: false,
                                editingMessageId: P.nullish,
                            },
                            () => 'pb-48'
                        )
                        .with(
                            {
                                usagePercent: P.number.gte(80),
                                isPro: false,
                                editingMessageId: P.nullish,
                            },
                            () => 'pb-48'
                        )
                        .with(
                            {
                                usagePercent: P.number.gte(100),
                                isPro: true,
                                editingMessageId: P.nullish,
                            },
                            () => 'pb-48'
                        )
                        .with(
                            {
                                usagePercent: P.number.gte(80),
                                isPro: true,
                                editingMessageId: P.nullish,
                            },
                            () => 'pb-48'
                        )
                        .with({ editingMessageId: P.string }, () => 'pb-40')
                        .otherwise(() => 'pb-40')
            )}
        >
            {children}
        </div>
    );
}
