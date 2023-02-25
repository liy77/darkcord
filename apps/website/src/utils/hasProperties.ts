import {
  ApiItemContainerMixin,
  ApiItemKind
} from "@/utils/api-extractor-model/src/index";
import { memberPredicate } from "./memberPredicate";
import { resolveMembers } from "./resolveMembers";

export function hasProperties(item: ApiItemContainerMixin) {
  return resolveMembers(item, memberPredicate).some(
    ({ item: member }) =>
      member.kind === ApiItemKind.Property ||
      member.kind === ApiItemKind.PropertySignature,
  );
}
