import {
	Documentation,
	DocumentationClass,
	DocumentationClassMethod,
	DocumentationProperty,
} from '~/types/documentation';

export function hasProperties(props: DocumentationProperty[]) {
	return props && props.length > 0;
}

export function hasMethods(methods: DocumentationClassMethod[]) {
	return methods && methods.length > 0;
}

export function typeKey(
	type: string[][] | { description: string; types: string[][][]; variable: boolean; nullable: boolean },
) {
	if (Array.isArray(type)) {
		return typeof type === 'string' ? type : type.join('-');
	}
}

export function shortenItemName(text: string, length = 20) {
	if (text.length > length) {
		return text.slice(0, length) + '...';
	}

	return text;
}
