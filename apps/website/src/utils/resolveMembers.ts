import { ApiItem, ApiItemContainerMixin } from "@microsoft/api-extractor-model";

export function resolveMembers<T extends ApiItem>(
	parent: ApiItemContainerMixin,
	predicate: (item: ApiItem) => item is T,
) {
	const seenItems = new Set<string>();
	const inheritedMembers = parent.findMembersWithInheritance().items.reduce((acc, item) => {
		if (predicate(item)) {
			acc.push({
				item,
				inherited:
					item.parent?.containerKey === parent.containerKey
						? undefined
						: (item.parent as ApiItemContainerMixin | undefined),
			});
			seenItems.add(item.containerKey);
		}

		return acc;
	}, new Array<{ inherited?: ApiItemContainerMixin | undefined; item: T }>());

	const mergedMembers = parent
		.getMergedSiblings()
		.filter((sibling) => sibling.containerKey !== parent.containerKey)
		.flatMap((sibling) => (sibling as ApiItemContainerMixin).findMembersWithInheritance().items)
		.filter((item) => predicate(item) && !seenItems.has(item.containerKey))
		.map((item) => ({ item: item as T, inherited: item.parent ? (item.parent as ApiItemContainerMixin) : undefined }));

	return [...inheritedMembers, ...mergedMembers];
}