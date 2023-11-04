import mainSource from '~/data/main-source';
import { Documentation } from '~/types/documentation';

export interface ItemRouteParams {
	item: string;
	version: string;
}

export async function fetchClassMember({ item }: ItemRouteParams) {
	const doc = (await mainSource.fetchDocs()) as Documentation;
	const classes = doc.classes;

	const classItem = classes.find((c) => c.name === item);

	if (!classItem) {
		return null;
	}

	return classItem;
}
