'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/util';

export function MainNav() {
	const pathname = usePathname();

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/guide" className="mr-6 flex items-center space-x-2">
				<span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
			</Link>
			<nav className="flex items-center space-x-6 text-sm font-medium">
				<Link
					href="#"
					className={cn(
						'hidden text-foreground/60 cursor-not-allowed opacity-800 transition-colors hover:text-foreground/80 lg:block',
					)}
				>
					Documentation
				</Link>
				<Link
					href="/guide"
					className={cn(
						'transition-colors hover:text-foreground/80',
						pathname.startsWith('/guide') ? 'text-foreground' : 'text-foreground/60',
					)}
				>
					Guide
				</Link>
				<Link
					href={siteConfig.links.github}
					className={cn('hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block')}
				>
					GitHub
				</Link>
			</nav>
		</div>
	);
}
