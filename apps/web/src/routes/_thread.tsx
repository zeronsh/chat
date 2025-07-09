import { createChatComponent } from '@zeronsh/ai/react';
import { MultiModalInput } from '@/components/chat/multi-modal-input';
import { AssistantMessage, PendingMessage, UserMessage } from '@/components/chat/message';
import type { DataParts, Metadata, Tools } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';
import { DefaultChatTransport } from 'ai';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';
import { useDatabase } from '@/context/database';
import { useQuery } from '@rocicorp/zero/react';
import { Fragment, useMemo } from 'react';
export const Route = createFileRoute('/_thread')({
    component: RouteComponent,
});

function RouteComponent() {
    const threadId = useParamsThreadId();

    const db = useDatabase();

    const [thread] = useQuery(
        db.query.thread
            .where('id', '=', threadId ?? '')
            .related('messages', q => q.orderBy('createdAt', 'asc'))
            .one()
    );

    const messages = useMemo(() => {
        return thread?.messages.map(message => message.message);
    }, [thread]);

    return (
        <Fragment>
            <title>{thread?.title ?? 'Zeron'}</title>
            <Thread
                id={threadId}
                messages={messages}
                initialScroll="instant"
                className="absolute inset-0 overflow-y-auto"
                contentClassName="flex flex-col gap-4 px-4 mx-auto max-w-3xl w-full"
                experimental_throttle={100}
                transport={
                    new DefaultChatTransport({
                        api: '/api/chat',
                        prepareSendMessagesRequest: async ({ id, messages }) => {
                            return {
                                body: {
                                    id,
                                    message: messages.at(-1),
                                },
                            };
                        },
                    })
                }
            />
        </Fragment>
    );
}

const Thread = createChatComponent<Metadata, DataParts, Tools>({
    UserMessage,
    AssistantMessage,
    PendingMessage,
    PromptInput: MultiModalInput,
});
