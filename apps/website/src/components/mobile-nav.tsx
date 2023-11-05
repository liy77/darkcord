'use client';

import { PropsWithChildren } from 'react';
import { useNav } from '~/contexts/nav';
import { MainNavItem } from '~/types';

import Link from 'next/link';

import { Route } from 'next';
import { cn } from '~/lib/util';
import { useLockBody } from '~/hooks/use-lock-body';
import { ScrollArea } from './ui/scroll-area';

export function MobileNav({ children, items }: PropsWithChildren<{ readonly items: MainNavItem[] }>) {
	useLockBody();

	const { toggle } = useNav();

	return (
		<div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-3 pb-12 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
			<div className="relative z-20 grid gap-6 rounded-md bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/130 border p-4 text-popover-foreground shadow-md">
				<Link onClick={toggle} href="/" className="flex items-center space-x-2">
					<span className="font-bold uppercase">darkcord</span>
				</Link>

				<nav className="grid grid-flow-row auto-rows-max text-sm">
					{items.map((item, index) => (
						<Link
							key={index}
							href={item.disabled ? '#' : (item.href as Route)}
							onClick={item.disabled ? (e) => e.preventDefault() : toggle}
							className={cn(
								'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
								item.disabled && 'cursor-not-allowed opacity-60',
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>
				{children}
			</div>
		</div>
	);
}
