import { GithubIcon } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/util';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import { buttonVariants } from './ui/button';
import { CommandMenu } from './command-menu';
import dynamic from 'next/dynamic';

const ThemeSwitcher = dynamic(() => import('./theme-switcher'))

export function SiteHeader() {
	return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<MainNav />
				<MobileNav />
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
					<nav className="flex items-center">
						<Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
							<div
								className={cn(
									buttonVariants({
										variant: 'ghost',
									}),
									'w-9 px-0',
								)}
							>
								<GithubIcon className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</div>
						</Link>
						<ThemeSwitcher />
					</nav>
				</div>
			</div>
		</header>
	);
}
