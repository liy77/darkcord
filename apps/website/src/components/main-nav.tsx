'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { useNav } from '~/contexts/nav';
import { Menu, XIcon } from 'lucide-react';
import { MainNavItem } from '~/types';
import { Icons } from './icons';
import { Button } from './ui/button';
import { cn } from '~/lib/util';
import { Route } from 'next';
import { MobileNav } from './mobile-nav';

export function MainNav({ children, items }: PropsWithChildren<{ readonly items?: MainNavItem[] }>) {
	const { opened, toggle } = useNav();
	const segment = useSelectedLayoutSegment();

	return (
		<div className="flex gap-6 md:gap-10">
			<Link href="/" className="hidden items-center space-x-2 md:flex">
				<Icons.logo className="w-24 h-24" />
			</Link>
			{items?.length ? (
				<nav className="hidden gap-6 md:flex">
					{items?.map((item, index) => (
						<Link
							key={index}
							href={item.disabled ? '#' : (item.href as Route)}
							className={cn(
								'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
								item.href?.startsWith(`/${segment}`) ? 'text-foreground' : 'text-foreground/60',
								item.disabled && 'cursor-not-allowed opacity-80',
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>
			) : null}
			<Button variant="ghost" className="flex items-center space-x-2 md:hidden" onClick={toggle}>
				{opened ? <XIcon /> : <Menu />}
			</Button>
			{opened && items && <MobileNav items={items}>{children}</MobileNav>}
		</div>
	);
}
