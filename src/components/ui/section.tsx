import { cn } from '@/lib/utils';

export function Section(props: {
    className?: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', props.className)}>
            <div className="flex flex-col gap-2">
                <div className="font-bold">{props.title}</div>
                <div className="text-muted-foreground text-sm">{props.description}</div>
            </div>
            <div className="col-span-2 flex flex-col gap-6">{props.children}</div>
        </div>
    );
}
