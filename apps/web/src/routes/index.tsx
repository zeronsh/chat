import { Message, MessageContent } from '@/components/ui/message';
import { createFileRoute } from '@tanstack/react-router';
import { Chat } from '@zeronsh/ai/react';
import { MultiModalInput } from '@/components/chat/multi-modal-input';
import { AssistantMessage, UserMessage } from '@/components/chat/message';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <Chat
            className="absolute inset-0 overflow-y-auto"
            contentClassName="flex flex-col gap-4"
            UserMessage={UserMessage}
            AssistantMessage={AssistantMessage}
            PendingMessage={() => <div className="max-w-2xl mx-auto w-full">Loading...</div>}
            PromptInput={MultiModalInput}
        />
    );
}
