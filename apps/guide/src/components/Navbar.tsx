import { iconSize, SearchIcon, ThemeAutoIcon } from '@expo/styleguide';
import { Button } from 'ariakit';
import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { isAppleDevice } from '~/utils/isAppleDevice';
import { Sidebar } from './Sidebar';
import { MDXPage } from './SidebarItems';

export function Navbar({ pages }: { pages?: MDXPage[] | undefined }) {
	const matches = useMedia('(min-width: 992px)', false);
	const [isMac, setIsMac] = useState<boolean | null>(null);
	const [opened, setOpened] = useState(false);

	useEffect(() => {
		if (matches) {
			setOpened(false);
		}
	}, [matches]);

	useEffect(() => {
		setIsMac(typeof navigator !== 'undefined' && isAppleDevice());
	}, []);

	return (
		<>
			<header className="header-base fixed top-0 left-0 z-20 w-full border-b">
				<div className="h-60px block px-6">
					<div className="flex h-full flex-row place-content-between place-items-center">
						<span>Logo</span>
						<div className="flex flex-row place-items-center gap-4">
							<Button as="div" className="border-base rounded border px-4 py-2.5 outline-0">
								<div className="flex flex-row place-items-center gap-24">
									<div className="flex flex-row place-items-center gap-2">
										<SearchIcon color="currentColor" size={iconSize.sm} />
										<span className="opacity-65">Search</span>
									</div>

									<div className="opacity-65 flex flex-row place-items-center gap-2">
										{isMac !== null && <div>{isMac ? '⌘' : 'Ctrl'} + K</div>}
									</div>
								</div>
							</Button>

							<Button
								aria-label="Toggle Theme"
								className="flex hidden h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded-full rounded border-0 bg-transparent p-0 leading-none no-underline outline-0 focus:ring active:translate-y-px"
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
