import { cn } from '@/lib/utils';

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
    return (
        <div
            className={cn(
                'flex w-full max-w-3xl mx-auto',
                className,
                !hasNextMessage && 'pb-40',
                !hasPreviousMessage && 'pt-40'
            )}
        >
            {children}
        </div>
    );
}
