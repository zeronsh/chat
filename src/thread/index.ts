import { AbstractChat, ChatInit, UIMessage } from 'ai';
import { ThreadState } from '@/thread/state';
import { createThreadStore, type ThreadStore } from '@/thread/store';

export class Thread<UI_MESSAGE extends UIMessage> extends AbstractChat<UI_MESSAGE> {
    protected state: ThreadState<UI_MESSAGE>;
    public store: ThreadStore<UI_MESSAGE>;

    constructor(init: ChatInit<UI_MESSAGE>) {
        const store = createThreadStore<UI_MESSAGE>({
            id: init.id,
            messages: init.messages ?? [],
        });
        const state = new ThreadState<UI_MESSAGE>(store);

        super({ ...init, state });

        this.state = state;
        this.store = store;
    }
}
