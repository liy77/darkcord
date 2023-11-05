'use client';

import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/util';
import { SidebarNavItem } from '~/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useNav } from '~/contexts/nav';

interface SidebarNavItemsProps {
	items: SidebarNavItem[];
	pathname: string | null;
}

export function SidebarNavItems({ items, pathname }: SidebarNavItemsProps) {
	const { toggle } = useNav();

	return items?.length ? (
		<div className="grid grid-flow-row auto-rows-max text-sm">
			{items.map((item, index) =>
				item.href && !item.disabled ? (
					<Link
						key={index}
						href={item.href as Route}
						onClick={toggle}
						className={cn(
							'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline',
							item.disabled && 'cursor-not-allowed opacity-60',
							pathname === item.href ? 'font-medium text-foreground' : 'text-muted-foreground',
						)}
						target={item.external ? '_blank' : ''}
						rel={item.external ? 'noreferrer' : ''}
					>
						{item.title}
						{item.label && (
							<span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
								{item.label}
							</span>
						)}
					</Link>
				) : (
					<span
						key={index}
						className={cn(
							'flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline',
							item.disabled && 'cursor-not-allowed opacity-60',
						)}
					>
						{item.title}
						{item.label && (
							<span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
								{item.label}
							</span>
						)}
					</span>
				),
			)}
		</div>
	) : null;
}

export function SidebarNav({ items }: { items: SidebarNavItem[] }) {
	const pathname = usePathname();

	return items.length ? (
		<Accordion type="multiple">
			{items.map((item, index) => (
				<div key={index} className="pb-4">
					<AccordionItem value={`${index}`}>
						<AccordionTrigger>
							<h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">{item.title}</h4>
						</AccordionTrigger>
						<AccordionContent>
							{item?.items?.length && <SidebarNavItems items={item.items} pathname={pathname} />}
						</AccordionContent>
					</AccordionItem>
				</div>
			))}
		</Accordion>
	) : null;
}
