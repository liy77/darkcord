import {
  ApiItem,
  ApiItemKind,
  ApiMethod,
  ApiMethodSignature,
  ApiProperty,
  ApiPropertySignature
} from "@microsoft/api-extractor-model";

export function memberPredicate(
  item: ApiItem,
): item is ApiMethod | ApiMethodSignature | ApiProperty | ApiPropertySignature {
  return (
    item.kind === ApiItemKind.Property ||
    item.kind === ApiItemKind.PropertySignature ||
    item.kind === ApiItemKind.Method ||
    item.kind === ApiItemKind.MethodSignature
  );
}
