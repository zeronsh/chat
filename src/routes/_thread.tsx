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
import { ThreadProvider } from '@/context/thread';
import { MessageList } from '@/components/thread/message/message-list';
import { ToolSidebar } from '@/components/layout/tool-sidebar';

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
            <AppSidebar />

            <ThreadProvider
                key={threadId}
                id={threadId}
                messages={messages}
                transport={
                    new DefaultChatTransport({
                        api: '/api/thread',
                        prepareSendMessagesRequest: async ({ id, messages, body }) => {
                            const settings = db.query.setting
                                .where('userId', '=', db.userID)
                                .one()
                                .materialize();
                            return {
                                body: {
                                    id,
                                    message: messages.at(-1),
                                    modelId: settings.data?.modelId,
                                    ...body,
                                },
                            };
                        },
                    })
                }
            >
                <main className="relative flex flex-col flex-1">
                    <Header />
                    <MessageList />
                </main>
                <ToolSidebar />
            </ThreadProvider>
        </SidebarProvider>
    );
}
