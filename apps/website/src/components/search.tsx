'use client';

import { HTMLAttributes, SyntheticEvent } from 'react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export function GuideSearch({ ...props }: HTMLAttributes<HTMLButtonElement>) {
	function onClick(event: SyntheticEvent) {
		event.preventDefault();

		return toast({
			title: 'Search is not yet implemented',
			description: 'This feature is still in development.',
		});
	}

	return (
		<>
			<Button
				variant="outline"
				className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
				onClick={() => onClick}
				{...props}
			>
				<span className="hidden lg:inline-flex">Search Guide...</span>
				<span className="inline-flex lg:hidden">Search...</span>
				<kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
		</>
	);
}
