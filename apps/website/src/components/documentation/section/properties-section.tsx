import { DocumentationClass } from '~/types/documentation';

export function PropertiesSection({ item }: { readonly item: DocumentationClass }) {
	return (
		<div className="flex flex-col space-x-4">
			<h2 className="font-semibold text-xl">Properties</h2>
		</div>
	);
}
