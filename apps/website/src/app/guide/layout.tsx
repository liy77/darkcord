import { PropsWithChildren } from 'react';

import { SidebarNav } from '~/components/sidebar-nav';
import { SiteFooter } from '~/components/site-footer';
import { SiteHeader } from '~/components/site-header';
import { ScrollArea } from '~/components/ui/scroll-area';
import { guideConfig } from '~/config/guide';

export default function GuideLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader navItems={guideConfig.mainNav} sidebarNavItems={guideConfig.sidebarNav} />

			<div className="container flex-1">
				<div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr]">
					<aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
						<ScrollArea className="h-full py-6 lg:py-8">
							<SidebarNav items={guideConfig.sidebarNav} />
						</ScrollArea>
					</aside>

					<main className="flex w-full flex-1 py-6 flex-col overflow-hidden">{children}</main>
				</div>
			</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
