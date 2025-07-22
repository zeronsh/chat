import type { UIMessage, ChatState, ChatStatus } from 'ai';
import type { ThreadStore } from '@/thread/store';

export class ThreadState<UI_MESSAGE extends UIMessage> implements ChatState<UI_MESSAGE> {
    private store: ThreadStore<UI_MESSAGE>;

    constructor(store: ThreadStore<UI_MESSAGE>) {
        this.store = store;
    }

    get messages(): UI_MESSAGE[] {
        return this.store.getState().messages;
    }

    set messages(newMessages: UI_MESSAGE[]) {
        this.store.getState().setMessages(newMessages);
    }

    get status(): ChatStatus {
        return this.store.getState().status;
    }

    set status(newStatus: ChatStatus) {
        this.store.getState().setStatus(newStatus);
    }

    get error(): Error | undefined {
        return this.store.getState().error;
    }

    set error(newError: Error | undefined) {
        this.store.getState().setError(newError);
    }

    pushMessage = (message: UI_MESSAGE) => {
        this.store.getState().pushMessage(message);
    };

    popMessage = () => {
        this.store.getState().popMessage();
    };

    replaceMessage = (index: number, message: UI_MESSAGE) => {
        this.store.getState().replaceMessage(index, message);
    };

    snapshot = <T>(snapshot: T) => {
        return structuredClone(snapshot);
    };
}
