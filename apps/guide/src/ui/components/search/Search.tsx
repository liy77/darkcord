import type { Dispatch, SetStateAction } from 'react';
import { CommandMenu, CommandMenuTrigger } from '../CommandMenu';
import type { MDXPage } from '../Sidebar/SidebarItems.jsx';

interface SearchProps {
	open: boolean;
	pages?: MDXPage[] | undefined;
	setOpen: Dispatch<SetStateAction<boolean>>;
	visibleOnMobile: boolean;
}

export function Search({ open, setOpen, visibleOnMobile, pages }: SearchProps) {
	return (
		<>
			<CommandMenu open={open} pages={pages} setOpen={setOpen} />
			<CommandMenuTrigger setOpen={setOpen} visibleOnMobile={visibleOnMobile} />
		</>
	);
}
