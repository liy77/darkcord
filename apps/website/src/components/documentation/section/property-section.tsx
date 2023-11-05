import { DocumentationClassProperty } from '~/types/documentation';
import { Type } from '../type';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { PropertyClassBadges } from '../property-class-badges';
import { ParameterTable } from '~/components/parameter-table';

export function PropertySection({ prop }: { readonly prop: DocumentationClassProperty }) {
	return (
		<div className="flex flex-col mb-4">
			<ScrollArea className="border w-full flex rounded p-5">
				<PropertyClassBadges item={prop} />

				<h3 className="scroll-m-20 text-xl font-semibold tracking-tight mr-2 space-x-2">
					<div className="flex flex-row items-center gap-2">
						<span>{`${prop.name}${prop.optional ? '?' : ''}`}</span>
						<span>:</span>
						{prop.type.map((type, idx) => (
							<Type key={idx} names={type} />
						))}
					</div>
				</h3>

				<div className="pl-2.5 pt-2.5">
					<p className="leading-7 break-words [&:not(:first-child)]:mt-6 font-medium">{prop.description}</p>
				</div>

				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
