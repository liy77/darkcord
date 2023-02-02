import { Dispatch, SetStateAction } from 'react';
import { CommandMenu } from '../command';
import { CommandMenuTrigger } from '../command/CommandMenuTrigger';

type SearchProps = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	visibleOnMobile: boolean;
};

export function Search({ open, setOpen, visibleOnMobile }: SearchProps) {
	return (
		<>
			<CommandMenu open={open} setOpen={setOpen} />
			<CommandMenuTrigger visibleOnMobile={visibleOnMobile} setOpen={setOpen} />
		</>
	);
}
