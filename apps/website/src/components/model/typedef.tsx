import { DocumentationTypeDefinition } from '~/types/documentation';
import { Documentation } from '../documentation/documentation';
import { Header } from '../documentation/header';

export function Typedef({ typedef }: { readonly typedef: DocumentationTypeDefinition }) {
	return (
		<Documentation>
			<Header name={typedef.name} description={typedef.description} />
		</Documentation>
	);
}
