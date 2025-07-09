import { createChatComponent } from '@zeronsh/ai/react';
import { MultiModalInput } from '@/components/chat/multi-modal-input';
import { AssistantMessage, PendingMessage, UserMessage } from '@/components/chat/message';
import type { DataParts, Metadata, Tools } from '@/components/chat/types';
import { createFileRoute } from '@tanstack/react-router';
import { DefaultChatTransport } from 'ai';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';

export const Route = createFileRoute('/_thread')({
    component: RouteComponent,
});

function RouteComponent() {
    const threadId = useParamsThreadId();

    return (
        <Thread
            id={threadId}
            className="absolute inset-0 overflow-y-auto"
            contentClassName="flex flex-col gap-4 px-4 mx-auto max-w-3xl w-full"
            transport={
                new DefaultChatTransport({
                    api: '/api/chat',
                })
            }
        />
    );
}

const Thread = createChatComponent<Metadata, DataParts, Tools>({
    UserMessage,
    AssistantMessage,
    PendingMessage,
    PromptInput: MultiModalInput,
});
