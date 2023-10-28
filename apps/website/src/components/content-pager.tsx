import Link from 'next/link';
import { Content } from 'contentlayer/generated';
import { buttonVariants } from './ui/button';
import { cn } from '~/lib/util';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { guideConfig } from '~/config/guide';
import { NavItem, NavItemWithChildren } from '~/types';
import { Route } from 'next';

export function ContentPager({ content }: { content: Content }) {
	const pager = getPagerForContent(content);

	if (!pager) {
		return null;
	}

	return (
		<div className="flex flex-row items-center justify-between">
			{pager?.prev && (
				<Link href={pager.prev.href as Route} className={cn(buttonVariants({ variant: 'ghost' }))}>
					<ChevronLeftIcon className="mr-2 h-4 w-4" />
					{pager.prev.title}
				</Link>
			)}
			{pager?.next && (
				<Link href={pager.next.href as Route} className={cn(buttonVariants({ variant: 'ghost' }), 'ml-auto')}>
					{pager.next.title}
					<ChevronRightIcon className="ml-2 h-4 w-4" />
				</Link>
			)}
		</div>
	);
}

export function getPagerForContent(content: Content) {
	const flattenedLinks = [null, ...flatten(guideConfig.sidebarNav), null];
	const activeIndex = flattenedLinks.findIndex((link) => content.slug === link?.href);
	const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null;
	const next = activeIndex !== flattenedLinks.length - 1 ? flattenedLinks[activeIndex + 1] : null;
	return {
		prev,
		next,
	};
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
	return links
		.reduce<NavItem[]>((flat, link) => {
			return flat.concat(link.items?.length ? flatten(link.items) : link);
		}, [])
		.filter((link) => !link?.disabled);
}
