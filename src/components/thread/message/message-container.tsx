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
    const { isPro, remainingCredits } = useAccess();
    return (
        <div
            className={cn(
                'flex w-full max-w-3xl mx-auto',
                className,
                !hasPreviousMessage && 'pt-40',
                !hasNextMessage &&
                    match({ editingMessageId, remainingCredits, isPro })
                        .with(
                            {
                                remainingCredits: P.number.lte(0),
                                isPro: false,
                                editingMessageId: P.nullish,
                            },
                            () => 'pb-48'
                        )
                        .with(
                            {
                                remainingCredits: P.number.lt(10),
                                isPro: false,
                                editingMessageId: P.nullish,
                            },
                            () => 'pb-48'
                        )
                        .with(
                            {
                                remainingCredits: P.number.lte(0),
                                isPro: true,
                                editingMessageId: P.nullish,
                            },
                            () => 'pb-48'
                        )
                        .with(
                            {
                                remainingCredits: P.number.lt(10),
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
