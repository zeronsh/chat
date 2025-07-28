'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { useStickToBottomContext } from 'use-stick-to-bottom';

export type ScrollToBottomButtonProps = {
    className?: string;
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: VariantProps<typeof buttonVariants>['size'];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollToBottomButton({
    className,
    variant = 'outline',
    size = 'sm',
    ...props
}: ScrollToBottomButtonProps) {
    const { isAtBottom, scrollToBottom } = useStickToBottomContext();

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            className={cn(
                'absolute -top-6 left-[50%] -translate-x-1/2 transition-all duration-150 ease-out',
                !isAtBottom
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none translate-y-4 scale-95 opacity-0',
                className
            )}
            onClick={() => scrollToBottom()}
            {...props}
        >
            {props.children || <ChevronDown className="h-5 w-5" />}
        </Button>
    );
}

export { ScrollToBottomButton };
