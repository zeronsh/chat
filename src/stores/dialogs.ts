import { createWithEqualityFn as create } from 'zustand/traditional';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export type DialogStore = {
    proDialog: {
        open: boolean;
        setOpen: (open: boolean) => void;
    };
};

export const dialogStore = create<DialogStore>()(
    devtools(
        subscribeWithSelector(set => ({
            proDialog: {
                open: false,
                setOpen: (open: boolean) => {
                    set(state => ({ ...state, proDialog: { ...state.proDialog, open } }));
                },
            },
        }))
    )
);
