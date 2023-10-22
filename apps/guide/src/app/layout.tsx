import type { Metadata } from 'next';
import { Providers } from './providers';
import type { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Inter as FontSans } from 'next/font/google';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/util';
import { SiteHeader } from '~/components/site-header';
import { SiteFooter } from '~/components/site-footer';

import '~/styles/main.css';
import '~/styles/mdx.css';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_LOCAL_DEV ? 'http://localhost:3000' : siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	viewport: {
		minimumScale: 1,
		initialScale: 1,
		width: 'device-width',
	},
	icons: {
		other: [
			{
				url: '/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
			{
				url: '/favicon-16x16.png',
				sizes: '16x16',
				type: 'image/png',
			},
		],
		apple: [
			'/apple-touch-icon.png',
			{
				url: '/safari-pinned-tab.svg',
				rel: 'mask-icon',
			},
		],
	},
	manifest: '/site.webmanifest',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' },
	],
	colorScheme: 'light dark',
	appleWebApp: {
		title: siteConfig.name,
	},
	applicationName: siteConfig.name,
	openGraph: {
		siteName: siteConfig.name,
		type: 'website',
		title: siteConfig.name,
		description: siteConfig.description,
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.description,
	},
	other: {
		'msapplication-TileColor': '#000000',
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
					<Providers>
						<div className="relative flex min-h-screen flex-col">
							<SiteHeader />
							<div className="flex-1">{children}</div>
							<SiteFooter />
						</div>
					</Providers>
					<Analytics />
				</body>
			</html>
		</>
	);
}
