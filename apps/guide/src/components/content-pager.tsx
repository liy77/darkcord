import { Content } from 'contentlayer/generated';
import Link from 'next/link';
import { guideConfig } from '~/config/guide';
import { NavItem, NavItemWithChildren } from '~/types';
import { buttonVariants } from './ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '~/lib/util';

export function ContentPager({ content }: { content: Content }) {
	const pager = getPagerForContent(content);

	if (!pager) {
		return null;
	}

	return (
		<div className="flex flex-row items-center justify-between">
			{pager?.prev?.href && (
				<Link href={pager.prev.href} key={pager.prev.href} className={buttonVariants({ variant: 'outline' })}>
					<ChevronLeftIcon className="mr-2 h-4 w-4" />
					{pager.prev.title}
				</Link>
			)}
			{pager?.next?.href && (
				<Link
					href={pager.next.href}
					key={pager.next.href}
					className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto')}
				>
					{pager.next.title}
					<ChevronRightIcon className="ml-2 h-4 w-4" />
				</Link>
			)}
		</div>
	);
}

export function getPagerForContent(content: Content) {
	const flattenedLinks = [null, ...flatten(guideConfig.sidebarNav), null];
	const activeIndex = flattenedLinks.findIndex(
    (link) => content.url === link?.href
  )
	const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null


	return {
		prev,
		next,
	}
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
	return links
		.reduce<NavItem[]>((flat, link) => {
			return flat.concat(link.items?.length ? flatten(link.items) : link);
		}, [])
		.filter((link) => !link?.disabled);
}
