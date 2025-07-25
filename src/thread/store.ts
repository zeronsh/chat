import { type ChatStatus, type UIMessage } from 'ai';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { ToolKeys } from '@/ai/types';

export type ToolSidebar = {
    messageId: string;
    tool: ToolKeys;
    toolCallId: string;
};

export type FileAttachment = {
    type: 'file';
    url: string;
    filename: string;
    mediaType: string;
};

export interface ThreadStoreImpl<UI_MESSAGE extends UIMessage> {
    id?: string;
    messageMap: Record<string, UI_MESSAGE>;
    messageIds: string[];
    messages: UI_MESSAGE[];
    status: ChatStatus;
    error: Error | undefined;

    toolSidebar: ToolSidebar | undefined;
    setToolSidebar: (toolSidebar: ToolSidebar | undefined) => void;

    input: string;
    setInput: (input: string) => void;

    attachments: FileAttachment[];
    setAttachments: (attachments: FileAttachment[]) => void;

    setMessages: (messages: UI_MESSAGE[]) => void;
    setStatus: (status: ChatStatus) => void;
    setError: (error: Error | undefined) => void;
    pushMessage: (message: UI_MESSAGE) => void;
    popMessage: () => void;
    replaceMessage: (index: number, message: UI_MESSAGE) => void;
}

export function createThreadStore<UI_MESSAGE extends UIMessage>(init: {
    id?: string;
    messages: UI_MESSAGE[];
}) {
    return create<ThreadStoreImpl<UI_MESSAGE>>()(
        devtools(
            subscribeWithSelector((set, get) => {
                return {
                    id: init.id,
                    messageMap: Object.fromEntries(init.messages.map(m => [m.id, m])),
                    messageIds: init.messages.map(m => m.id),
                    messages: init.messages,
                    status: 'ready',
                    error: undefined,
                    toolSidebar: undefined,
                    input: '',
                    setInput: (input: string) => set({ input }, false, 'thread/setInput'),
                    attachments: [],
                    setAttachments: (attachments: FileAttachment[]) =>
                        set({ attachments }, false, 'thread/setAttachments'),
                    setToolSidebar: (toolSidebar: ToolSidebar | undefined) =>
                        set({ toolSidebar }, false, 'thread/setToolSidebar'),
                    setStatus: (status: ChatStatus) => set({ status }, false, 'thread/setStatus'),
                    setError: (error: Error | undefined) =>
                        set({ error }, false, 'thread/setError'),
                    pushMessage: (message: UI_MESSAGE) => {
                        get().setMessages([...get().messages, message]);
                    },
                    popMessage: () => {
                        get().setMessages(get().messages.slice(0, -1));
                    },
                    replaceMessage: (index: number, message: UI_MESSAGE) => {
                        get().setMessages([
                            ...get().messages.slice(0, index),
                            structuredClone(message),
                            ...get().messages.slice(index + 1),
                        ]);
                    },
                    setMessages: (messages: UI_MESSAGE[]) => {
                        const { messageIds: oldMessageIds } = get();

                        const lastMessageId = messages[messages.length - 1]?.id;
                        const lastOldMessageId = oldMessageIds[oldMessageIds.length - 1];
                        const hasMessagesChanged = lastMessageId !== lastOldMessageId;
                        const messageIds = hasMessagesChanged
                            ? messages.map(m => m.id)
                            : oldMessageIds;

                        const update = {
                            messages,
                            messageIds,
                            messageMap: Object.fromEntries(messages.map(m => [m.id, m])),
                        };

                        set(update, false, 'thread/setMessages');
                    },
                };
            })
        )
    );
}

export type ThreadStore<UI_MESSAGE extends UIMessage> = ReturnType<
    typeof createThreadStore<UI_MESSAGE>
>;
