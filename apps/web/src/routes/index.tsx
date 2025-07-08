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
            PromptInput={({ sendMessage, status, stop }) => (
                <div>
                    <button onClick={() => sendMessage({ text: 'Write a 1000 word story' })}>
                        Send
                    </button>
                    <button onClick={() => stop()}>Stop</button>
                    <div>{status}</div>
                </div>
            )}
        />
    );
}
