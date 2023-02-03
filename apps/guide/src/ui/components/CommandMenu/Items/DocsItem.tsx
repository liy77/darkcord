import { Button } from 'ariakit/button';
import { Command } from 'cmdk';
import type { Dispatch, SetStateAction } from 'react';
import { GuideIcon } from './icons.jsx';

interface DocsItemProps {
	description?: string | undefined;
	link?: string | undefined;
	setOpen: Dispatch<SetStateAction<boolean>>;
	title: string;
}

export function DocsItem({ setOpen, link, title, description }: DocsItemProps) {
	return (
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		<Button as="a" href={link || '/'}>
			<Command.Item
				onSelect={() => {
					setOpen(false);
				}}
			>
				<div className="mt-2 inline-flex items-center gap-3 break-words group-[aria-selected=true]:hover:bg-white">
					<div className="shrink-0">
						<GuideIcon />
					</div>
					<div className="flex flex-col">
						<p
							className="font-500 text-dark dark:text-[#ecedee]"
							style={{ fontSize: '0.875rem', lineHeight: '1.5714286', letterSpacing: '-0.006rem' }}
						>
							{title}
						</p>

						{description && (
							<p
								className="font-400 text-dark dark:text-[#787f85]"
								style={{ fontSize: '0.75rem', lineHeight: '1.58333' }}
							>
								{' Guides > '} {description}
							</p>
						)}
					</div>
				</div>
			</Command.Item>
		</Button>
	);
}
