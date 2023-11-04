import { Documentation, DocumentationClass, DocumentationParameter } from '~/types/documentation';
import { hasProperties } from './util';
import { PropertiesSection } from './section/properties-section';

export function Members({ item }: { readonly item: DocumentationClass }) {
	return (
		<div className="hidden text-sm xl:block">
			<div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
				{hasProperties(item) ? <PropertiesSection item={item} /> : null}
			</div>
		</div>
	);
}
