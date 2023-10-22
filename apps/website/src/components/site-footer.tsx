import { Route } from 'next';
import Link from 'next/link';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/util';

export function SiteFooter({ className }: { className?: string }) {
	return (
		<footer className={cn('py-6 md:px-8 md:py-0', className)}>
			<div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
				<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
					Darkcord built by{' '}
					<Link
						className="font-medium underline underline-offset-4"
						href="https://github.com/JustAWaifuHunter"
						target="_blank"
						rel="noreferrer"
					>
						Liy
					</Link>
					. Websites built by{' '}
					<Link
						href="https://github.com/nicolasribeiroo"
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						Nicolas Ribeiro
					</Link>{' '}
					based on{' '}
					<Link
						href="https://ui.shadcn.com"
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						shadcn/ui
					</Link>{' '}
					website. The source code is available on{' '}
					<Link
						href={siteConfig.links.github as Route}
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						GitHub
					</Link>
					.
				</p>
			</div>
		</footer>
	);
}
