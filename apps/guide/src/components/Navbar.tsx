import { HamburgerIcon, iconSize, ThemeAutoIcon } from '@expo/styleguide';
import { Button } from 'ariakit/button';
import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { Search } from '~/ui/components/index.js';
import { Sidebar } from './Sidebar.jsx';
import { MDXPage } from './SidebarItems.jsx';

export function Navbar({ pages }: { pages?: MDXPage[] | undefined }) {
	const matches = useMedia('(min-width: 992px)', false);
	const [opened, setOpened] = useState(false);
	const [open, setOpen] = useState(false);

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
							className="focus:ring-width-2 focus:ring-blue flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px lg:hidden"
							onClick={() => setOpened((open) => !open)}
						>
							<HamburgerIcon size={iconSize.xl} color="#787f85" />
						</Button>

						<span className="hidden md:flex md:flex-row">Placeholder</span>

						<div className="flex flex-row place-items-center gap-4">
							<Search visibleOnMobile={matches} open={open} setOpen={setOpen} />

							<Button
								style={{ display: matches ? 'flex' : 'none' }}
								aria-label="Toggle Theme"
								className="flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded-full rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 active:translate-y-px"
							>
								<ThemeAutoIcon size={iconSize.xl} color="currentColor" />
							</Button>
						</div>
					</div>
				</div>
			</header>
			<Sidebar opened={opened} pages={pages} />
		</>
	);
}
