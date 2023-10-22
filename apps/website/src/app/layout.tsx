import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { PropsWithChildren } from 'react';
import { cn } from '~/lib/util';
import { siteConfig } from '~/config/site';
import { Providers } from './providers';

import '~/styles/main.css';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_LOCAL_DEV ? 'http://localhost:3000' : siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
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
		{
			media: '(prefers-color-scheme: light)',
			color: 'light',
		},
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
		locale: 'en_US',
		description: siteConfig.description,
	},
	twitter: {
		card: 'summary_large_image',
		creator: '@mldyxniskii',
		title: siteConfig.name,
		description: siteConfig.description,
	},
	other: {
		'msapplication-TileColor': '#000000',
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={cn('scroll-smooth min-h-screen bg-background antialiased font-sans', fontSans.variable)}>
				<Providers>{children}</Providers>
				<Analytics />
			</body>
		</html>
	);
}
