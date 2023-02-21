import { resolveItemURI } from '@/utils/resolveItemURI';
import type { ApiDeclaredItem } from '@microsoft/api-extractor-model';
import { ItemLink } from './ItemLink';

export function InheritanceText({ parent }: { parent: ApiDeclaredItem }) {
	return (
		<span className="font-semibold">
			Inherited from{' '}
			<ItemLink
				className="text-blue-700 font-semibold hover:underline"
				itemURI={resolveItemURI(parent)}
			>
				{parent.displayName}
			</ItemLink>
		</span>
	);
}