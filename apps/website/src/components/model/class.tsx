import { DocumentationClass } from '~/types/documentation';
import { Documentation } from '../documentation/documentation';
import { ObjectHeader } from '../documentation/object-header';
import { Members } from '../documentation/members';

export function Class({ clazz }: { readonly clazz: DocumentationClass }) {
	return (
		<Documentation>
			<ObjectHeader item={clazz} />
			<Members item={clazz} />
		</Documentation>
	);
}
