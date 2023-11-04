import { Documentation, DocumentationClass, DocumentationProperty } from '~/types/documentation';

export function hasProperties(item: DocumentationClass) {
	return item.props && item.props.length > 0;
}
