'use client';

import { useNav } from '~/contexts/nav';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '~/lib/util';
import { siteConfig } from '~/config/site';
import { ScrollArea } from './ui/scroll-area';
import { guideConfig } from '~/config/guide';
import { Fragment } from 'react';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';

export function MobileNav() {
	const { opened, setOpened } = useNav();

	return (
		<Sheet open={opened} onOpenChange={setOpened}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
				>
					<MenuIcon className="h-5 w-5" />
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="pr-0">
				<MobileLink href="/" className="flex items-center" onOpenChange={setOpened}>
					<span className="font-bold">{siteConfig.name}</span>
				</MobileLink>
			</SheetContent>
			<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
				<div className="flex flex-col space-y-3">
					{guideConfig.mainNav?.map(
						(item) =>
							item.href && (
								<MobileLink key={item.href} href={item.href} onOpenChange={setOpened}>
									{item.title}
								</MobileLink>
							),
					)}
				</div>
				<div className="flex flex-col space-y-2">
					{guideConfig.sidebarNav.map((item, index) => (
						<div key={index} className="flex flex-col space-y-3 pt-6">
							<h4 className="font-medium">{item.title}</h4>
							{item?.items?.length &&
								item.items.map((item) => (
									<Fragment key={item.href}>
										{!item.disabled &&
											(item.href ? (
												<MobileLink href={item.href} onOpenChange={setOpened} className="text-muted-foreground">
													{item.title}
												</MobileLink>
											) : (
												item.title
											))}
									</Fragment>
								))}
						</div>
					))}
				</div>
			</ScrollArea>
		</Sheet>
	);
}

interface MobileLinkProps extends LinkProps {
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
	const router = useRouter();

	return (
		<Link
			href={href}
			onClick={() => {
				router.push(href.toString());
				onOpenChange?.(false);
			}}
			className={cn(className)}
			{...props}
		>
			{children}
		</Link>
	);
}
