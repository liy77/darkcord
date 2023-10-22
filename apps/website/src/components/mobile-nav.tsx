'use client';

import { PropsWithChildren } from 'react';
import { useNav } from '~/contexts/nav';
import { MainNavItem } from '~/types';
import { Sheet, SheetContent } from './ui/sheet';
import Link from 'next/link';
import { ScrollArea } from './ui/scroll-area';
import { Route } from 'next';
import { cn } from '~/lib/util';
import { Icons } from './icons';
import { useLockBody } from '~/hooks/use-lock-body';

export function MobileNav({ children, items }: PropsWithChildren<{ readonly items: MainNavItem[] }>) {
	useLockBody();

	const { opened, setOpened } = useNav();

	return (
		<Sheet open={opened} onOpenChange={setOpened}>
			<SheetContent side="left" className="pr-0">
				<Link
					href="/"
					onClick={() => setOpened(false)}
					className="flex min-w-max shrink place-items-center place-content-center"
				>
					<Icons.logo className="mr-32 h-6 w-15" />
				</Link>

				<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
					<nav className="grid grid-flow-row auto-rows-max text-sm">
						{items.map((item, idx) => (
							<Link
								key={idx}
								href={item.disabled ? '#' : (item.href as Route)}
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
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
