import { createFileRoute } from '@tanstack/react-router';
import { Chat } from '@zeronsh/ai/react';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <Chat
            className="absolute inset-0 overflow-y-auto"
            UserMessage={({ message }) => <div>{JSON.stringify(message, null, 2)}</div>}
            AssistantMessage={({ message }) => <div>{JSON.stringify(message, null, 2)}</div>}
            PendingMessage={() => <div>Loading...</div>}
            PromptInput={({ sendMessage, status, stop }) => (
                <div className="absolute bottom-0 left-0 right-0 bg-background">
                    <button onClick={() => sendMessage({ text: 'Write a 1000 word story' })}>
                        Send
                    </button>
                    <button onClick={() => stop()}>Stop</button>
                </div>
            )}
        />
    );
}
