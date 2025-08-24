import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipPositioner,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { lazy } from 'react';

const Markdown = import.meta.env.SSR
    ? (_: { children: string }) => null
    : lazy(() => import('@/components/ui/markdown').then(m => ({ default: m.Markdown })));

export type MessageProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLProps<HTMLDivElement>;

const Message = ({ children, className, ...props }: MessageProps) => (
    <div className={cn('flex gap-3', className)} {...props}>
        {children}
    </div>
);

export type MessageAvatarProps = {
    src: string;
    alt: string;
    fallback?: string;
    delayMs?: number;
    className?: string;
};

const MessageAvatar = ({ src, alt, fallback, delayMs, className }: MessageAvatarProps) => {
    return (
        <Avatar className={cn('h-8 w-8 shrink-0', className)}>
            <AvatarImage src={src} alt={alt} />
            {fallback && <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>}
        </Avatar>
    );
};

export type MessageContentProps = {
    children: React.ReactNode;
    markdown?: boolean;
    className?: string;
    animated?: boolean;
} & React.ComponentProps<typeof Markdown> &
    React.HTMLProps<HTMLDivElement>;

const MessageContent = ({
    children,
    markdown = false,
    animated = false,
    className,
    ...props
}: MessageContentProps) => {
    const classNames = cn('rounded-lg min-w-full break-words whitespace-normal', className);

    return markdown ? (
        <Markdown className={classNames} {...props} animated={animated}>
            {children as string}
        </Markdown>
    ) : (
        <div className={classNames} {...props}>
            {children}
        </div>
    );
};

export type MessageActionsProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageActions = ({ children, className, ...props }: MessageActionsProps) => (
    <div className={cn('text-muted-foreground flex items-center gap-2', className)} {...props}>
        {children}
    </div>
);

export type MessageActionProps = {
    className?: string;
    tooltip: React.ReactNode;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
} & React.ComponentProps<typeof Tooltip>;

const MessageAction = ({
    tooltip,
    children,
    className,
    side = 'top',
    ...props
}: MessageActionProps) => {
    return (
        <TooltipProvider>
            <Tooltip {...props}>
                <TooltipTrigger render={<div>{children}</div>} />
                <TooltipPositioner side={side}>
                    <TooltipContent className={className}>{tooltip}</TooltipContent>
                </TooltipPositioner>
            </Tooltip>
        </TooltipProvider>
    );
};

export { Message, MessageAvatar, MessageContent, MessageActions, MessageAction };
