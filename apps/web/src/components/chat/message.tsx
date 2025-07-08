import type { UIMessage } from 'ai';
import { Part } from './part';
import type { AssistantMessageProps, UserMessageProps } from '@zeronsh/ai/react';
import { Message } from '@/components/ui/message';

export function UserMessage({ message }: UserMessageProps<any>) {
    return (
        <div className="flex justify-end max-w-2xl mx-auto w-full">
            <Message className="bg-muted p-4 rounded-l-3xl rounded-tr-3xl rounded-br-lg max-w-[80%]">
                <UIMessage message={message} />
            </Message>
        </div>
    );
}

export function AssistantMessage({ message }: AssistantMessageProps<any>) {
    return (
        <div className="flex justify-start max-w-2xl mx-auto w-full">
            <Message className="bg-muted p-4 rounded-l-3xl rounded-tr-3xl rounded-br-lg max-w-[80%]">
                <UIMessage message={message} />
            </Message>
        </div>
    );
}

function UIMessage({ message }: { message: UIMessage<any, any> }) {
    return message.parts.map((part, i) => <Part key={i} part={part} />);
}
