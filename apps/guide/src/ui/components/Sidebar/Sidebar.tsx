import { GithubIcon } from '@expo/styleguide';
import { Button } from 'ariakit/button';
import { Separator } from 'ariakit/separator';
import { Scrollbars } from 'react-custom-scrollbars-2';
import type { MDXPage } from './SidebarItems.jsx';

export function Sidebar({ opened, pages }: { opened: boolean; pages: MDXPage[] | undefined }) {
	return (
		<nav
			className={`h-[calc(100vh - 73px)] border-base fixed top-[61px] left-0 bottom-0 z-20 w-full border-r bg-white dark:bg-[#151718] ${
				opened ? 'block' : 'hidden'
			} lg:w-76 lg:max-w-76 lg:block`}
		>
			<div className="mt-5 flex flex-col">
				<div className="text-dark text-dark ml-6 flex min-h-[38px] rounded-md bg-transparent dark:text-white">
					<Button
						aria-label="GitHub"
						as="a"
						className="focus:ring-width-2 focus:ring-blue flex flex-row items-center gap-3 outline-0 focus:rounded focus:border-0 focus:ring"
						href="https://github.com/JustAWaifuHunter/darkcord"
						rel="noopener noreferrer"
						target="_blank"
					>
						<GithubIcon className="fill-dark dark:fill-white" />

						<span className="text-dark dark:text-white">GitHub</span>
					</Button>
				</div>

				<Separator className="border-base my-5" />
			</div>
			<Scrollbars
				autoHide
				hideTracksWhenNotNeeded
				renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
				renderTrackVertical={(props) => (
					<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
				)}
				universal
			>
				{pages ?? null}
			</Scrollbars>
		</nav>
	);
}
