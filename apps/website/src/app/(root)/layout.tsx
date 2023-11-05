import { PropsWithChildren } from 'react';
import { MainNav } from '~/components/main-nav';
import { SiteFooter } from '~/components/site-footer';
import { rootConfig } from '~/config/root';

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="container z-40 bg-background">
				<div className="flex h-20 items-center justify-between py-6">
					<MainNav items={rootConfig.mainNav} />
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
