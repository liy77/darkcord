import { Route } from 'next';
import Link from 'next/link';
import { siteConfig } from '~/config/site';
import { buttonVariants } from './ui/button';
import { cn } from '~/lib/util';
import { GithubIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { MainNav } from './main-nav';
import { SidebarNav } from './sidebar-nav';
import { GuideSearch } from './search';
import { NavItem, NavItemWithChildren } from '~/types';

const ThemeSwitcher = dynamic(() => import('./theme-switcher'));

interface SiteHeaderProps {
	navItems: NavItem[];
	sidebarNavItems: NavItemWithChildren[];
}

export function SiteHeader({ navItems, sidebarNavItems }: SiteHeaderProps) {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<MainNav items={navItems}>
					<SidebarNav items={sidebarNavItems} />
				</MainNav>
				<div className="flex flex-1 items-center space-x-4 sm:justify-end">
					<div className="flex-1 sm:grow-0">
						<GuideSearch />
					</div>
					<nav className="flex space-x-2">
						<Link
							href={siteConfig.links.github as Route}
							target="_blank"
							rel="noreferrer"
							className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
						>
							<GithubIcon className="h-4 w-4" />
							<span className="sr-only">GitHub</span>
						</Link>

						<ThemeSwitcher />
					</nav>
				</div>
			</div>
		</header>
	);
}
