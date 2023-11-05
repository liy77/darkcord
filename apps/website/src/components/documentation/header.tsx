import { PropsWithChildren } from 'react';
import { Separator } from '../ui/separator';
import { FileCodeIcon } from 'lucide-react';
import { SourceButton } from './source-button';
import { Documentation } from '~/types/documentation';

interface HeaderProps {
	name: string;
	description?: string;
}

export function Header({ name, description, children }: PropsWithChildren<HeaderProps>) {
	return (
		<>
			<div className="flex flex-col space-y-4">
				<h2 className="flex flex-row items-center justify-between scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					<span className="flex-col flex items-center gap-2">
						{name}
						{description ? <p className="text-xl text-muted-foreground">{description}</p> : null}
					</span>
					{children}
				</h2>
			</div>
			<Separator />
		</>
	);
}
