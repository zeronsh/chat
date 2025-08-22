import { AbstractChat, ChatInit, UIMessage } from 'ai';
import { ThreadState } from '@/thread/state';
import { createThreadStore, type ThreadStore } from '@/thread/store';
import { ThreadMessage } from '@/ai/types';

export class Thread extends AbstractChat<ThreadMessage> {
    protected state: ThreadState;
    public store: ThreadStore<ThreadMessage>;

    constructor(init: ChatInit<ThreadMessage>) {
        const store = createThreadStore<ThreadMessage>({
            id: init.id,
            messages: init.messages ?? [],
        });
        const state = new ThreadState(init.id!);

        super({ ...init, state });

        this.state = state;
        this.store = store;
    }
}
