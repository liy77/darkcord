import mainSource from '~/data/main-source';
import { Documentation } from '~/types/documentation';

export interface ItemRouteParams {
	item: string;
	version: string;
}

export async function fetchClassMember({ item }: ItemRouteParams) {
	const doc = (await mainSource.fetchDocs()) as Documentation;
	const classes = doc.items.classes;

	const classItem = classes.find((c) => c.name === item);

	if (!classItem) {
		return null;
	}

	return classItem;
}

export async function fetchFunctionMember({ item }: ItemRouteParams) {
	const doc = (await mainSource.fetchDocs()) as Documentation;
	const functions = doc.items.functions;

	if (!functions) {
		return null;
	}

	const functionItem = functions.find((c) => c.name === item);

	if (!functionItem) {
		return null;
	}

	return functionItem;
}

export async function fetchTypedefMember({ item }: ItemRouteParams) {
	const doc = (await mainSource.fetchDocs()) as Documentation;
	const typedefs = doc.items.typedefs;

	const typedefItem = typedefs.find((c) => c.name === item);

	if (!typedefItem) {
		return null;
	}

	return typedefItem;
}
