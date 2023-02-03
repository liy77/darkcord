import type { PropsWithChildren } from 'react';

export function DiscordMessages({ children }: PropsWithChildren) {
	return <div className="font-source-sans-pro pt-0.1 rounded bg-[rgb(54_57_63)] pb-4">{children}</div>;
}
