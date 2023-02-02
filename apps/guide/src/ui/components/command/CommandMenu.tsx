import { XIcon } from '@expo/styleguide';
import { Command } from 'cmdk';
import { Dispatch, SetStateAction, useState } from 'react';
import { CommandFooter } from './CommandFooter';
import { DocsItem } from './Items/DocsItem';

type CommandMenuProps = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
	const [query, setQuery] = useState('');

	return (
		<Command.Dialog
			className="bg-white dark:bg-[#151718]"
			open={open}
			onOpenChange={setOpen}
			label="Command Menu"
			shouldFilter={false}
		>
			<Command.Input
				className="text-dark dark:text-[#ecedee]"
				onValueChange={setQuery}
				placeholder="Quick search..."
				value={query}
			/>

			<XIcon
				color="#787f85"
				style={{
					position: 'absolute',
					top: 25,
					right: 25,
					cursor: 'pointer',
					padding: '4px',
					borderRadius: '4px',
				}}
				size={28}
				className="hover:bg-[#202425]"
				onClick={() => setOpen(false)}
			/>

			<Command.List>
				<Command.Empty>No results found</Command.Empty>

				<Command.Group className="text-dark dark:text-[#9ba1a6]" heading="Darkcord guide">
					<DocsItem setOpen={setOpen} />
				</Command.Group>
			</Command.List>

			<CommandFooter />
		</Command.Dialog>
	);
}
