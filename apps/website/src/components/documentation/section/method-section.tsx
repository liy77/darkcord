import Link from 'next/link';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { DocumentationClassMethod } from '~/types/documentation';
import { MethodClassBadges } from '../method-class-badges';
import { ParameterTable } from '~/components/parameter-table';

export function MethodSection({ method }: { readonly method: DocumentationClassMethod }) {
	const params = method.params ? method.params.filter((param) => !param.name.includes('.')) : null;

	return (
		<div className="flex flex-col mb-4">
			<ScrollArea className="border w-full flex rounded p-5">
				<MethodClassBadges item={method} />

				<h3 className="scroll-m-20 text-xl font-semibold tracking-tight mr-2 space-x-2">
					<Link href="#">
						.{method.name}(
						{params?.map((param) => (
							<span key={param.name} className="text-blue-600">
								{param.variable ? '...' : ''}
								{param.name}
							</span>
						))}
						)
					</Link>
				</h3>

				<div className="pl-2.5 pt-2.5">
					<p className="leading-7 break-words [&:not(:first-child)]:mt-6 font-medium">{method.description}</p>
					{params && <ParameterTable params={params} />}
				</div>

				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
