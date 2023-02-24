import { resolveMembers } from "@/utils/resolveMembers";
import type {
  ApiItem,
  ApiItemContainerMixin,
  ApiProperty,
  ApiPropertyItem,
  ApiPropertySignature
} from "@microsoft/api-extractor-model";
import { ApiItemKind } from "@microsoft/api-extractor-model";
import { Fragment, useMemo } from "react";
import { Property, PropertySeparatorType } from "./Property";

export function isPropertyLike(
  item: ApiItem,
): item is ApiProperty | ApiPropertySignature {
  return (
    item.kind === ApiItemKind.Property ||
    item.kind === ApiItemKind.PropertySignature
  );
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
          </Fragment>
        );
      }),
    [members],
  );

  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{propertyItems}</div>;
}
