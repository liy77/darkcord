'use client';

import { Analytics } from '@vercel/analytics/react';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '~/lib/util';
import { Providers } from './providers';

import '~/styles/main.css';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export default function GlobalError({ error }: { readonly error: Error }) {
	console.error(error);

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn('scroll-smooth min-h-screen bg-background antialiased font-sans', fontSans.variable)}>
				<Providers>
					<main className="mx-auto max-w-2xl min-h-screen">
						<div className="mx-auto max-w-lg min-h-screen flex flex-col items-center justify-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
							<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">500</h1>
							<h2 className="text-[2rem] md:text-[3rem]">Error.</h2>
						</div>
					</main>
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
