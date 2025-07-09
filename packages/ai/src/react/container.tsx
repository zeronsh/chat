import { type StickToBottomProps, StickToBottom } from 'use-stick-to-bottom';

export type ChatContainerRootProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement> &
    StickToBottomProps;

export type ChatContainerContentProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps = {
    className?: string;
    ref?: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export function ChatContainerRoot({ children, className, ...props }: ChatContainerRootProps) {
    return (
        <StickToBottom className={className} role="log" {...props}>
            {children}
        </StickToBottom>
    );
}

export function ChatContainerContent({ children, className, ...props }: ChatContainerContentProps) {
    return (
        <StickToBottom.Content className={className} {...props}>
            {children}
        </StickToBottom.Content>
    );
}

export function ChatContainerScrollAnchor({ className, ...props }: ChatContainerScrollAnchorProps) {
    return <div className={className} aria-hidden="true" {...props} />;
}
