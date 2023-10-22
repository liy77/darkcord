'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { useNav } from '~/contexts/nav';
import { Menu } from 'lucide-react';
import { MainNavItem } from '~/types';
import { Icons } from './icons';
import { Button } from './ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { cn } from '~/lib/util';
import { Route } from 'next';
import { MobileNav } from './mobile-nav';

export function MainNav({ children, items }: PropsWithChildren<{ readonly items?: MainNavItem[] }>) {
	const { setOpened, opened } = useNav();
	const segment = useSelectedLayoutSegment();

	return (
		<div className="flex gap-6 md:gap-10">
			<Link href="/" className="hidden items-center space-x-2 md:flex">
				<Icons.logo className="w-24 h-24" />
			</Link>
			{items?.length && (
				<NavigationMenu className="hidden gap-6 md:flex">
					<NavigationMenuList>
						{items?.map((item, idx) => (
							<NavigationMenuItem key={idx}>
								<Link
									legacyBehavior
									passHref
									href={item.disabled ? '#' : (item.href as Route)}
									className={cn(
										'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
										item.href?.startsWith(`/${segment}`) ? 'text-foreground' : 'text-foreground/60',
									)}
								>
									<NavigationMenuLink
										className={cn(navigationMenuTriggerStyle(), item.disabled && 'cursor-not-allowed opacity-80')}
									>
										{item.title}
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			)}
			<Button
				variant="ghost"
				className="flex items-center space-x-2 md:hidden"
				onClick={() => setOpened((open) => !open)}
			>
				<Menu />
			</Button>
			{opened && items && <MobileNav items={items}>{children}</MobileNav>}
		</div>
	);
}
