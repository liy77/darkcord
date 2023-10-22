'use client';

import { HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Event, trackEvent } from '~/lib/events';
import { cn } from '~/lib/util';
import { NpmCommands } from '~/types/unist';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export async function copyToClipboardWithMeta(value: string, event?: Event) {
	navigator.clipboard.writeText(value);
	if (event) {
		trackEvent(event);
	}
}

interface CopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
	value: string;
	src?: string;
	event?: Event['name'];
}

export function CopyButton({ value, className, src, event, ...props }: CopyButtonProps) {
	const [hasCopied, setHasCopied] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	return (
		<Button
			size="icon"
			variant="ghost"
			className={cn('relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50', className)}
			onClick={() => {
				copyToClipboardWithMeta(
					value,
					event
						? {
								name: event,
								properties: {
									code: value,
								},
						  }
						: undefined,
				);
				setHasCopied(true);
			}}
			{...props}
		>
			<span className="sr-only">Copy</span>
			{hasCopied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
		</Button>
	);
}

interface CopyNpmCommandButtonProps extends DropdownMenuTriggerProps {
	commands: Required<NpmCommands>;
}

export function CopyNpmCommandButton({ commands, className, ...props }: CopyNpmCommandButtonProps) {
	const [hasCopied, setHasCopied] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	const copyCommand = useCallback((value: string, pm: 'npm' | 'pnpm' | 'yarn' | 'bun') => {
		copyToClipboardWithMeta(value, {
			name: 'copy_npm_command',
			properties: {
				command: value,
				pm,
			},
		});
		setHasCopied(true);
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className={cn('relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50', className)}
				>
					{hasCopied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
					<span className="sr-only">Copy</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => copyCommand(commands.__npmCommand__, 'npm')}>npm</DropdownMenuItem>
				<DropdownMenuItem onClick={() => copyCommand(commands.__yarnCommand__, 'yarn')}>yarn</DropdownMenuItem>
				<DropdownMenuItem onClick={() => copyCommand(commands.__pnpmCommand__, 'pnpm')}>pnpm</DropdownMenuItem>
				<DropdownMenuItem onClick={() => copyCommand(commands.__bunCommand__, 'bun')}>bun</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
