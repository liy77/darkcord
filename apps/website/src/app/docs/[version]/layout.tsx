import { PropsWithChildren } from 'react';
import { SidebarNav } from '~/components/sidebar-nav';
import { SiteFooter } from '~/components/site-footer';
import { SiteHeader } from '~/components/site-header';
import { docsConfig } from '~/config/docs';
import mainSource from '~/data/main-source';
import { SidebarNavItem } from '~/types';
import { Documentation } from '~/types/documentation';

export interface VersionRouteParams {
	version: string;
}

function serializeIntoSidebarItemData(docs: Documentation, version: string): SidebarNavItem[] {
	return [
		{
			title: 'Classes',
			items: docs.classes.map((item) => ({
				title: item.name,
				items: [],
				href: `/docs/${version}/class/${item.name}`,
			})),
		},
	]
}

export default async function PackageLayout({ children, params }: PropsWithChildren<{ params: VersionRouteParams }>) {
	const doc = await mainSource.fetchDocs() as Documentation;

	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<SiteHeader navItems={docsConfig.mainNav} sidebarNavItems={serializeIntoSidebarItemData(doc, params.version)} />

			<div className="container flex-1">
				<div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
					<aside className="hidden w-full pr-4 border-r flex-col md:flex">
						<SidebarNav items={serializeIntoSidebarItemData(doc, params.version)} />
					</aside>

					<main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
				</div>
			</div>

			<SiteFooter className="border-t" />
		</div>
	);
}
