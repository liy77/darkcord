'use client';

import { HTMLAttributes, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCommandMenu } from '~/contexts/command-menu';
import { CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { CommandInput } from 'cmdk';

export function GuideSearch({ ...props }: HTMLAttributes<HTMLButtonElement>) {
	const router = useRouter();
	const { setTheme } = useTheme();
	const { toggle, opened } = useCommandMenu();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggle();
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const runCommand = useCallback((command: () => unknown) => {
		toggle();
		command();
	}, []);

	return (
		<>
			<Button
				variant="outline"
				className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
				onClick={toggle}
				{...props}
			>
				<span className="hidden lg:inline-flex">Search Guide...</span>
				<span className="inline-flex lg:hidden">Search...</span>
				<kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
			<CommandDialog open={opened} onOpenChange={toggle}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Links">
						<CommandItem
							key="/"
							value="home"
							onSelect={() => {
								runCommand(() => router.push('/'));
							}}
						>
							Home
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="Theme">
						<CommandItem onSelect={() => runCommand(() => setTheme('light'))}>Light</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>Dark</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme('system'))}>System</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
