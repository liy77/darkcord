import { PropsWithChildren } from 'react';

import { SidebarNav } from '~/components/sidebar-nav';
import { SiteFooter } from '~/components/site-footer';
import { SiteHeader } from '~/components/site-header';
import { guideConfig } from '~/config/guide';

export default function GuideLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader navItems={guideConfig.mainNav} sidebarNavItems={guideConfig.sidebarNav} />
			<div className="container flex-1">
				<div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
					<aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
						<SidebarNav items={guideConfig.sidebarNav} />
					</aside>
					{children}
				</div>
			</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
