import { createChatComponent } from '@zeronsh/ai/react';
import { MultiModalInput } from '@/components/thread/multi-modal-input';
import { AssistantMessage, PendingMessage, UserMessage } from '@/components/thread/message';
import type { DataParts, Metadata, Tools } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';
import { DefaultChatTransport } from 'ai';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';
import { useDatabase } from '@/context/database';
import { useQuery } from '@rocicorp/zero/react';
import { useMemo } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { Title } from '@/components/meta/title';
import { motion } from 'framer-motion';
import { Stars } from '@/components/ui/stars';

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
        <SidebarProvider>
            <Title title={thread?.title} />
            <AppSidebar />
            <main className="relative flex flex-col flex-1">
                <motion.div
                    className="absolute inset-0 w-full"
                    initial={{ opacity: 0, scale: 0.7, y: 0 }}
                    animate={{
                        opacity: threadId ? 0 : 1,
                        scale: threadId ? 0.7 : 1,
                        y: threadId ? 50 : 0,
                    }}
                    transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                >
                    {!threadId && <Stars />}
                    <div className="moon" />
                </motion.div>
                <Header />
                <Thread
                    id={threadId}
                    streamId={thread?.streamId}
                    messages={messages}
                    initialScroll="instant"
                    className="absolute inset-0 bottom-4 overflow-y-auto"
                    contentClassName="flex flex-col gap-4 px-4 mx-auto max-w-3xl w-full"
                    experimental_throttle={100}
                    transport={
                        new DefaultChatTransport({
                            api: '/api/chat',
                            prepareSendMessagesRequest: async ({ id, messages }) => {
                                const settings = db.query.setting
                                    .where('userId', '=', db.userID)
                                    .one()
                                    .materialize();
                                return {
                                    body: {
                                        id,
                                        message: messages.at(-1),
                                        modelId: settings.data?.modelId,
                                    },
                                };
                            },
                        })
                    }
                />
            </main>
        </SidebarProvider>
    );
}

const Thread = createChatComponent<Metadata, DataParts, Tools>({
    UserMessage,
    AssistantMessage,
    PendingMessage,
    PromptInput: MultiModalInput,
});
