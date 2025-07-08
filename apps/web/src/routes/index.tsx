import { createFileRoute } from '@tanstack/react-router';
import { Chat } from '@zeronsh/ai/react';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <Chat
            UserMessage={({ message }) => <div>{JSON.stringify(message, null, 2)}</div>}
            AssistantMessage={({ message }) => <div>{JSON.stringify(message, null, 2)}</div>}
            PendingMessage={() => <div>Loading...</div>}
            PromptInput={({ sendMessage }) => (
                <div>
                    <button onClick={() => sendMessage({ text: 'Hello' })}>Send</button>
                </div>
            )}
        />
    );
}
