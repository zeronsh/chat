import { Message, MessageContent } from '@/components/ui/message';
import { createFileRoute } from '@tanstack/react-router';
import { Chat } from '@zeronsh/ai/react';
import type { UIMessage, UIMessagePart } from 'ai';
import { match } from 'ts-pattern';
import { MultiModalInput } from '@/components/chat/multi-modal-input';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <Chat
            className="absolute inset-0 overflow-y-auto"
            contentClassName="flex flex-col gap-4"
            UserMessage={({ message }) => (
                <div className="flex justify-end max-w-2xl mx-auto w-full">
                    <Message className="bg-muted p-4 rounded-l-3xl rounded-tr-3xl rounded-br-lg max-w-[80%]">
                        <UIMessage message={message} />
                    </Message>
                </div>
            )}
            AssistantMessage={({ message }) => (
                <div className="max-w-2xl mx-auto w-full">
                    <Message>
                        <UIMessage message={message} />
                    </Message>
                </div>
            )}
            PendingMessage={() => <div className="max-w-2xl mx-auto w-full">Loading...</div>}
            PromptInput={MultiModalInput}
        />
    );
}

function UIMessage({ message }: { message: UIMessage }) {
    return message.parts.map((part, i) => <Part key={i} part={part} />);
}

function Part({ part }: { part: UIMessagePart<any, any> }) {
    return match(part)
        .with({ type: 'text' }, ({ text }) => <MessageContent markdown>{text}</MessageContent>)
        .otherwise(() => null);
}
