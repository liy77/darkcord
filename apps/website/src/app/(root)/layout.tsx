import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { MainNav } from '~/components/main-nav';
import { SiteFooter } from '~/components/site-footer';
import { buttonVariants } from '~/components/ui/button';
import { rootConfig } from '~/config/root';
import { cn } from '~/lib/util';

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="container z-40 bg-background">
				<div className="flex h-20 items-center justify-between py-6">
					<MainNav items={rootConfig.mainNav} />
					<nav>
						<Link href="/docs" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4')}>
							Docs
						</Link>
					</nav>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
