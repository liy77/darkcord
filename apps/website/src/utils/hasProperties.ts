import {
  ApiItemContainerMixin,
  ApiItemKind
} from "@microsoft/api-extractor-model";
import { memberPredicate } from "./memberPredicate";
import { resolveMembers } from "./resolveMembers";

export function hasProperties(item: ApiItemContainerMixin) {
  return resolveMembers(item, memberPredicate).some(
    ({ item: member }) =>
      member.kind === ApiItemKind.Property ||
      member.kind === ApiItemKind.PropertySignature,
  );
}
