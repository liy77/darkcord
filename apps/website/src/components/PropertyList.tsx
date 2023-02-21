import { resolveMembers } from '@/utils/resolveMembers';
import type {
	ApiItem,
	ApiItemContainerMixin,
	ApiProperty,
	ApiPropertyItem,
	ApiPropertySignature
} from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { Fragment, useMemo } from 'react';
import { Property, PropertySeparatorType } from './Property';

export function isPropertyLike(item: ApiItem): item is ApiProperty | ApiPropertySignature {
	return item.kind === ApiItemKind.Property || item.kind === ApiItemKind.PropertySignature;
}

export function PropertyList({ item }: { item: ApiItemContainerMixin }) {
	const members = resolveMembers(item, isPropertyLike);

	const propertyItems = useMemo(
		() =>
			members.map((prop) => {
				return (
					<Fragment key={prop.item.displayName}>
						<Property
							item={prop.item as ApiPropertyItem}
							separator={PropertySeparatorType.Type}
						/>
						<div className="border-light-900 dark:border-blue -mx-8 border-t-2" />
					</Fragment>
				);
			}),
		[members],
	);

	return <div className="flex flex-col gap-4">{propertyItems}</div>;
}