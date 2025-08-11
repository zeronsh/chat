import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { StickToBottomInstance } from 'use-stick-to-bottom';

const DEFAULT_ESTIMATE_SIZE = 35;

type ZListProps<T> = {
    className?: string;

    data: T[];
    getItemKey: (item: T) => string;
    renderItem: (ctx: { item: T; index: number }) => React.ReactNode;
    estimateSize?: (ctx: { item: T; index: number }) => number;
    overscan?: number;
    instance: StickToBottomInstance;
};

export function ZList<T>(props: ZListProps<T>) {
    const virtualizer = useVirtualizer({
        count: props.data.length,
        getScrollElement: () => props.instance.scrollRef.current,
        estimateSize: index => {
            const item = props.data[index];
            return props.estimateSize?.({ item, index }) ?? DEFAULT_ESTIMATE_SIZE;
        },
        overscan: props.overscan ?? 1,
    });

    const items = virtualizer.getVirtualItems();

    return (
        <div ref={props.instance.scrollRef} className={props.className}>
            <div
                ref={props.instance.contentRef}
                style={{
                    height: virtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative',
                }}
            >
                <div
                    className="px-4"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${items[0]?.start ?? 0}px)`,
                    }}
                >
                    {items.map(item => (
                        <div
                            key={props.getItemKey(props.data[item.index])}
                            data-index={item.index}
                            ref={virtualizer.measureElement}
                        >
                            {props.renderItem({
                                item: props.data[item.index],
                                index: item.index,
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
