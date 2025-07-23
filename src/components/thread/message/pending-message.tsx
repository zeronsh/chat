import { Button } from '@/components/ui/button';
import { Message, MessageActions } from '@/components/ui/message';
import { CopyIcon } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

export function PendingMessage() {
    return (
        <Message className="flex-col w-full mx-auto py-4">
            <Loader variant="typing" />
            <MessageActions className="opacity-0">
                <Button variant="ghost" size="icon">
                    <CopyIcon className="size-3" />
                </Button>
            </MessageActions>
        </Message>
    );
}
