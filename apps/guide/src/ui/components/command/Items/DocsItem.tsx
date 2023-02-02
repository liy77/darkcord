import { Command } from 'cmdk';
import { Dispatch, SetStateAction } from 'react';
import { openLink } from '../utils';
import { GuideIcon } from './icons';

type DocsItemProps = {
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export function DocsItem({ setOpen }: DocsItemProps) {
	return (
		<Command.Item
			onSelect={() => {
				openLink('/')
				setOpen(false);
			}}
		>
			<div className="mt-2 inline-flex items-center gap-3 break-words">
				<div className="shrink-0">
					<GuideIcon />
				</div>
				<div className="flex flex-col">
					<p
						className="font-500 text-dark dark:text-[#ecedee]"
						style={{ fontSize: '0.875rem', lineHeight: '1.5714286', letterSpacing: '-0.006rem' }}
					>
						Introduction
					</p>

					<p className="font-400 text-dark dark:text-[#787f85]" style={{ fontSize: '0.75rem', lineHeight: '1.58333' }}>
						Guides
					</p>
				</div>
			</div>
		</Command.Item>
	);
}
