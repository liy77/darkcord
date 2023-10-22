import { PropsWithChildren } from 'react';
import { cn } from '~/lib/util';

export function DiscordMessages({ children, rounded = true }: PropsWithChildren<{ rounded?: boolean }>) {
	return <div className={cn('font-sans pt-0.1 bg-[rgb(54_57_63)] pb-4', rounded && 'rounded')}>{children}</div>;
}
