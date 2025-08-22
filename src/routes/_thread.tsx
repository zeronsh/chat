import { createFileRoute } from '@tanstack/react-router';
import { DefaultChatTransport } from 'ai';
import { useParamsThreadId } from '@/hooks/use-params-thread-id';
import { useDatabase, useThreadFromParams } from '@/hooks/use-database';
import { useMemo } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { Title } from '@/components/meta/title';
import { ThreadProvider } from '@/context/thread';
import { MessageList } from '@/components/thread/message/message-list';
import { ToolSidebar } from '@/components/layout/tool-sidebar';
import { ThreadContainer } from '@/components/thread/thread-container';
import { useAppStore } from '@/stores/app';

export const Route = createFileRoute('/_thread')({
    component: RouteComponent,
});

function RouteComponent() {
    const db = useDatabase();
    const threadId = useParamsThreadId();
    const thread = useAppStore(state => state.getThreadById(threadId));

    return (
        <SidebarProvider>
            <Title title={thread?.title} />
            <AppSidebar />
            <ThreadProvider
                key={threadId}
                id={threadId}
                messages={thread?.messages}
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
                <ThreadContainer>
                    <Header />
                    <MessageList />
                </ThreadContainer>
                <ToolSidebar />
            </ThreadProvider>
        </SidebarProvider>
    );
}
