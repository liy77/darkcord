'use client';

import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { CmdKProvider } from '~/contexts/cmdk';
import { NavProvider } from '~/contexts/nav';
import { useSystemThemeFallback } from '~/hooks/use-system-theme-fallback';

export function Providers({ children }: PropsWithChildren) {
	useSystemThemeFallback();

	return (
		<ThemeProvider enableSystem defaultTheme="system" attribute="class">
			<NavProvider>
				<CmdKProvider>{children}</CmdKProvider>
			</NavProvider>
		</ThemeProvider>
	);
}
