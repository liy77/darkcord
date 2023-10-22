import { PropsWithChildren } from 'react';
import { fetchModelJSON } from '~/app/docAPI';
import { MainNav } from '~/components/main-nav';
import { NavBar } from '~/components/nav';
import { SiteFooter } from '~/components/site-footer';
import { rootConfig } from '~/config/root';

export interface VersionRouteParams {
	version: string;
}

export default async function PackageLayout({ children, params }: PropsWithChildren<{ params: VersionRouteParams }>) {
	const modelJSON = await fetchModelJSON(params.version);

	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<MainNav items={rootConfig.mainNav} />
				</div>
			</header>
			<div className="container grid flex-1 border-b gap-12 md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] border-r flex-col md:flex">
					<NavBar items={rootConfig.mainNav} />
				</aside>
				<main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
			</div>
			<SiteFooter />
		</div>
	);
}
