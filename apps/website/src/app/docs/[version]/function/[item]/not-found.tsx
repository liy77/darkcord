'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/util';

export default function NotFound() {
	const pathname = usePathname();
	const href = pathname.split('/').slice(0, -2).join('/');

	return (
		<div className="mx-auto max-w-lg min-h-screen flex flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
			<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">404</h1>
			<h2 className="text-[2rem] md:text-[3rem]">Not found.</h2>
			<Link
				className={cn(
					buttonVariants({ size: 'lg' }),
					'transform-gpu appearance-none no-underline outline-none active:translate-y-px',
				)}
				href={href as Route}
			>
				Return
			</Link>
		</div>
	);
}
