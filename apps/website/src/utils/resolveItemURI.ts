import { ApiItem } from "@/utils/api-extractor-model/src/index";

export function resolveItemURI(item: ApiItem): string {
	return `/${item.displayName}:${item.kind}`;
}
