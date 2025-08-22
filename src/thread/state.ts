import type { UIMessage, ChatState, ChatStatus } from 'ai';
import type { ThreadStore } from '@/thread/store';
import { useAppStore } from '@/stores/app';
import { ThreadMessage } from '@/ai/types';

const store = useAppStore;

export class ThreadState implements ChatState<ThreadMessage> {
    constructor(private id: string) {}

    get messages(): ThreadMessage[] {
        return store.getState().getMessagesByThreadId(this.id);
    }

    set messages(newMessages: ThreadMessage[]) {
        store.getState().setMessagesByThreadId(this.id, newMessages);
    }

    get status(): ChatStatus {
        return store.getState().getThreadById(this.id)?.status ?? 'ready';
    }

    set status(newStatus: ChatStatus) {
        store.getState().setStatusByThreadId(this.id, newStatus);
    }

    get error(): Error | undefined {
        return undefined;
    }

    set error(newError: Error | undefined) {
        // do nothing
    }

    pushMessage = (message: ThreadMessage) => {
        store.getState().pushMessageByThreadId(this.id, message);
    };

    popMessage = () => {
        store.getState().popMessageByThreadId(this.id);
    };

    replaceMessage = (index: number, message: ThreadMessage) => {
        store.getState().replaceMessageByThreadId(this.id, index, message);
    };

    snapshot = <T>(snapshot: T) => {
        return structuredClone(snapshot);
    };
}
