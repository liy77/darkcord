import type { Dispatch, SetStateAction } from 'react';
import { CommandMenu, CommandMenuTrigger } from '..';
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
			<CommandMenu visibleOnMobile={visibleOnMobile} open={open} pages={pages} setOpen={setOpen} />
			<CommandMenuTrigger setOpen={setOpen} visibleOnMobile={visibleOnMobile} />
		</>
	);
}
