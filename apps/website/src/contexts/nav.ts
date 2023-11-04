import { create } from 'zustand';

interface NavState {
	opened: boolean;
	setOpened: (opened: boolean) => void;
	toggle: () => void;
}

export const useNav = create<NavState>((set) => ({
	opened: false,
	setOpened: (opened) => set({ opened }),
	toggle: () => set((state) => ({ opened: !state.opened })),
}));
