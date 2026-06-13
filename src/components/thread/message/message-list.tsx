import { useMemo, type ReactNode } from 'react';
import {
    MugenVList,
    VStack,
    useMugenSelector,
    useMugenVirtualizer,
    type MugenInstance,
} from '@wingleeio/mugen';
import { ArrowDownIcon } from 'lucide-react';
import { MultiModalInput } from '@/components/thread/multi-modal-input';
import { StreamFadeOverlay } from '@/components/thread/stream-fade';
import { TurnRow } from '@/components/thread/message/turn-row';
import { buildTurns, type Turn } from '@/components/thread/turns';
import { useThreadSelector } from '@/context/thread';
import { useAutoResume } from '@/hooks/use-auto-resume';

export function MessageList() {
    const messages = useThreadSelector(state => state.messages);
    const status = useThreadSelector(state => state.status);

    useAutoResume();

    const items = useMemo(() => buildTurns(messages, status), [messages, status]);
    const list = useMugenVirtualizer({ items });

    return (
        <div className="absolute inset-0">
            <MugenVList
                instance={list}
                getKey={turn => turn.id}
                render={TurnRow}
                font="15px Geist, sans-serif"
                lineHeight={26}
                maxW={768}
                overscan={320}
                initialScroll="bottom"
                stickToBottom
                renderTop={() => <VStack height={72} />}
                renderBottom={() => <VStack height={176} />}
                className="h-full"
            />
            <StreamFadeOverlay />
            <MultiModalInput aboveInput={<ScrollToBottom list={list} />} />
        </div>
    );
}

function ScrollToBottom({ list }: { list: MugenInstance<Turn> }): ReactNode {
    const awayFromBottom = useMugenSelector(list, state => state.distanceFromBottom > 200);

    return (
        <button
            type="button"
            data-hidden={!awayFromBottom}
            onClick={() => list.scrollToBottom({ behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background py-1.5 pl-2.5 pr-3.5 text-xs text-muted-foreground shadow-sm transition-all duration-200 hover:text-foreground data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-1 data-[hidden=true]:opacity-0"
        >
            <ArrowDownIcon className="size-3" />
            Scroll to bottom
        </button>
    );
}
