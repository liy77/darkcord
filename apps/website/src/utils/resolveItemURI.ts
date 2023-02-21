import { ApiItem } from "@microsoft/api-extractor-model";

export function resolveItemURI(item: ApiItem): string {
	return `/${item.displayName}:${item.kind}`;
}