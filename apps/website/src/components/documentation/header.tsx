import { PropsWithChildren } from 'react';
import { Separator } from '../ui/separator';
import { FileCodeIcon } from 'lucide-react';

interface HeaderProps {
	name: string;
	description?: string;
	sourceURL?: string;
}

export function Header({ name, description, sourceURL }: PropsWithChildren<HeaderProps>) {
	return (
		<>
			<div className="flex flex-col space-y-4">
				<h2 className="flex flex-row items-center justify-between gap-2 break-all text-4xl lg:text-5xl font-bold">
					<span className="flex-col flex items-center gap-2">
						{name}
						{description ? <p className="text-xl text-muted-foreground">{description}</p> : null}
					</span>

					{sourceURL && (
						<a href={sourceURL} rel="external noopener noreferrer" target="_blank">
						<FileCodeIcon />
					</a>
					)}
				</h2>
			</div>
			<Separator />
		</>
	);
}
