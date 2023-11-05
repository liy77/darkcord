import { PropsWithChildren } from 'react';
import { shortenItemName } from '~/components/documentation/util';
import { SidebarNav } from '~/components/sidebar-nav';
import { SiteFooter } from '~/components/site-footer';
import { SiteHeader } from '~/components/site-header';
import { ScrollArea } from '~/components/ui/scroll-area';
import { docsConfig } from '~/config/docs';
import mainSource from '~/data/main-source';
import { SidebarNavItem } from '~/types';
import { Documentation, DocumentationItems } from '~/types/documentation';

export interface VersionRouteParams {
	version: string;
}

function serializeIntoSidebarItemData(
	{ classes, functions, typedefs }: DocumentationItems,
	version: string,
): SidebarNavItem[] {
	return [
		{
			title: 'Classes',
			items: classes.map((item) => ({
				title: shortenItemName(item.name),
				items: [],
				href: `/docs/${version}/class/${item.name}`,
			})),
		},
		{
			title: 'Functions',
			items: functions!.map((item) => ({
				title: shortenItemName(item.name),
				items: [],
				href: `/docs/${version}/function/${item.name}`,
			})),
		},
		{
			title: 'TypeDefs',
			items: typedefs.map((item) => ({
				title: shortenItemName(item.name),
				items: [],
				href: `/docs/${version}/typedef/${item.name}`,
			})),
		},
	];
}

export default async function DocumentationLayout({
	children,
	params,
}: PropsWithChildren<{ params: VersionRouteParams }>) {
	const docs = (await mainSource.fetchDocs()) as Documentation;

	const docItems = docs.items;

	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader
				navItems={docsConfig.mainNav}
				sidebarNavItems={serializeIntoSidebarItemData(docItems, params.version)}
			/>

			<div className="container flex-1">
				<div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr]">
					<aside className="fixed top-14 z-30 -ml-2 mr-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
						<ScrollArea className="h-full py-6 lg:py-8">
							<div className="p-4">
								<SidebarNav items={serializeIntoSidebarItemData(docItems, params.version)} />
							</div>
						</ScrollArea>
					</aside>

					<main className="flex w-full flex-1 py-6 flex-col overflow-hidden">{children}</main>
				</div>
			</div>

			<SiteFooter className="border-t" />
		</div>
	);
}
