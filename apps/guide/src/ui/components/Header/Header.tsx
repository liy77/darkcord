import { HamburgerIcon, iconSize } from '@expo/styleguide';
import { Button } from 'ariakit/button';
import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import type { MDXPage } from '..';
import { Search, Sidebar } from '..';

interface HeaderProps {
	pages?: MDXPage[] | undefined;
	searchPages?: MDXPage[] | undefined;
	url?: string | undefined;
}

export function Header({ pages, searchPages, url }: HeaderProps) {
	const matches = useMedia('(min-width: 992px)', false);
	const [opened, setOpened] = useState(false);
	const [open, setOpen] = useState(false);
	const placeholderString = searchPages?.find((page) => page.url === url)?.frontmatter.title ?? '';

	function setTheme(prefersDarkMode, persistedColorPreference) {
		if (persistedColorPreference === 'dark' || (prefersDarkMode && persistedColorPreference !== 'light')) {
			document.documentElement.classList.toggle('dark', true);
		} else {
			document.documentElement.classList.toggle('dark', false);
		}
	}

	useEffect(() => {
		if (matches) {
			setOpened(false);
		}
	}, [matches]);

	return (
		<>
			<header className="header-base fixed top-0 left-0 z-20 w-full border-b">
				<div className="h-60px block px-6">
					<div className="flex h-full flex-row place-content-between place-items-center">
						<Button
							aria-label="Menu"
							className="dark:hover:bg-dark-200 hover:bg-light-700 focus:ring-width-2 focus:ring-blue flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px lg:hidden"
							onClick={() => setOpened((open) => !open)}
						>
							<HamburgerIcon color="#787f85" size={iconSize.xl} />
						</Button>

						<span className="hidden md:flex md:flex-row">{placeholderString}</span>

						<div className="flex flex-row place-items-center gap-4">
							<Search open={open} pages={searchPages} setOpen={setOpen} visibleOnMobile={matches} />
						</div>
					</div>
				</div>
			</header>
			<Sidebar opened={opened} pages={pages} />
		</>
	);
}
