import { XIcon } from '@expo/styleguide';
import { Command } from 'cmdk';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { MDXPage } from '../Sidebar/SidebarItems.jsx';
import { CommandFooter } from './CommandFooter.jsx';
import { DocsItem } from './Items/DocsItem.jsx';

interface CommandMenuProps {
	open: boolean;
	pages: MDXPage[] | undefined;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CommandMenu({ open, setOpen, pages }: CommandMenuProps) {
	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const searchResultsItems = useMemo(
		() =>
			searchResults?.map((item) => (
				<DocsItem
					description={item.frontmatter.description}
					key={`guide-${item.frontmatter.title}`}
					link={item.url}
					setOpen={setOpen}
					title={item.frontmatter.title}
				/>
			)) ?? [],
		[searchResults, setOpen],
	);

	useEffect(() => {
		if (query && pages) {
			const results = pages.filter((page) => {
				return page.frontmatter.title.toLowerCase().includes(query.toLowerCase());
			});

			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	return (
		<Command.Dialog
			className="bg-white dark:bg-[#151718]"
			label="Command Menu"
			onOpenChange={setOpen}
			open={open}
			shouldFilter={false}
		>
			<XIcon
				className="absolute cursor-pointer rounded-[4px] p-[4px] hover:bg-[#202425]"
				color="#787f85"
				onClick={() => setOpen(false)}
				size={28}
				style={{
					top: 25,
					right: 25,
				}}
			/>

			<Command.Input
				className="text-dark dark:text-[#ecedee]"
				onValueChange={setQuery}
				placeholder="Quick search..."
				value={query}
			/>

			<Command.List>
				<Command.Empty>No results found</Command.Empty>
				{query
					? searchResultsItems
					: pages?.map((page) => (
							<DocsItem
								description={page.frontmatter.description}
								key={`guide-${page.frontmatter.title}`}
								link={page.url}
								setOpen={setOpen}
								title={page.frontmatter.title}
							/>
					  ))}

				{/* <Command.Group className="text-dark dark:text-[#9ba1a6]" heading="Darkcord guide" /> */}
			</Command.List>

			<CommandFooter />
		</Command.Dialog>
	);
}
