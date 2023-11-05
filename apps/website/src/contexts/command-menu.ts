import { create } from 'zustand';

interface CommandMenuState {
	opened: boolean;
	setOpened: (opened: boolean) => void;
	toggle: () => void;
}

export const useCommandMenu = create<CommandMenuState>((set) => ({
	opened: false,
	setOpened: (opened) => set({ opened }),
	toggle: () => set((state) => ({ opened: !state.opened })),
}));
