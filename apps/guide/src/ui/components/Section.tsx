import { PropsWithChildren } from 'react';

interface SectionProps {
	title: string;
}

export function Section({ title, children }: PropsWithChildren<SectionProps>) {
	return (
		<div className="flex flex-col">
			<div className="rounded p-3 outline-0">
				<div className="flex flex-row place-content-between place-items-center">
					<div className="flex flex-row place-items-center gap-3">
						<span className="font-medium">{title}</span>
					</div>
				</div>
			</div>

			{children}
		</div>
	);
}
