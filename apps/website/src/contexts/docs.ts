import { create } from 'zustand';
import { Documentation } from '~/types/documentation';

interface DocsState {
	docs: Documentation | null;
	tag: string;
	version: string;
	setTag: (tag: string) => void;
	setDocs: (docs: Documentation) => void;
	setVersion: (version: string) => void;
}

export const useDocs = create<DocsState>((set) => ({
	docs: null,
	tag: 'class',
	version: 'main',
	setTag: (tag) => set({ tag }),
	setDocs: (docs) => set({ docs }),
	setVersion: (version) => set({ version }),
}));
