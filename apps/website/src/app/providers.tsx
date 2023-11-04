'use client';

import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { Toaster } from '~/components/ui/toaster';
import { useSystemThemeFallback } from '~/hooks/use-system-theme-fallback';

export function Providers({ children }: PropsWithChildren) {
	useSystemThemeFallback();

	return (
		<ThemeProvider enableSystem defaultTheme="system" attribute="class">
			{children}
			<Toaster />
		</ThemeProvider>
	);
}
