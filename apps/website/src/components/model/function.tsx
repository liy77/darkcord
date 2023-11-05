import { DocumentationClassMethod, DocumentationTypeDefinition } from '~/types/documentation';
import { Documentation } from '../documentation/documentation';
import { Header } from '../documentation/header';

export function Function({ func }: { readonly func: DocumentationClassMethod }) {
	return (
		<Documentation>
			<Header name={func.name} description={func.description} />
		</Documentation>
	);
}
