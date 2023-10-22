'use client';

import {
	type PropsWithChildren,
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
	useState,
	useMemo,
} from 'react';

export const CmdKContext = createContext<{ opened: boolean; setOpened: Dispatch<SetStateAction<boolean>> }>({
	opened: false,
	setOpened: (_) => {},
});

export const CmdKProvider = ({ children }: PropsWithChildren) => {
	const [opened, setOpened] = useState(false);
	const value = useMemo(() => ({ opened, setOpened }), [opened]);

	return <CmdKContext.Provider value={value}>{children}</CmdKContext.Provider>;
};

export function useCmdK() {
	return useContext(CmdKContext);
}
