import { AssistantMessage, PendingMessage, UserMessage } from '@/components/chat/message';
import { MultiModalInput } from '@/components/chat/multi-modal-input';
import type { DataParts, Metadata } from '@/components/chat/types';
import { Chat } from '@zeronsh/ai/react';

export function Base() {
    return (
        <Chat<Metadata, DataParts, any>
            className="absolute inset-0 overflow-y-auto"
            contentClassName="flex flex-col gap-4 px-4 mx-auto max-w-3xl w-full"
            UserMessage={UserMessage}
            AssistantMessage={AssistantMessage}
            PendingMessage={PendingMessage}
            PromptInput={MultiModalInput}
        />
    );
}
