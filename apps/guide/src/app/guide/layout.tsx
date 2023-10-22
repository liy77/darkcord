import { PropsWithChildren } from 'react';
import { SidebarNav } from '~/components/sidebar-nav';
import { ScrollArea } from '~/components/ui/scroll-area';
import { guideConfig } from '~/config/guide';

export default function GuideLayout({ children }: PropsWithChildren) {
	return (
			<div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
				<aside className="fixed top-14 z-30 border-r -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
					<ScrollArea className="h-full py-6 pl-8 pr-6 lg:py-8">
						<SidebarNav items={guideConfig.sidebarNav} />
					</ScrollArea>
				</aside>
				{children}
			</div>
	);
}
