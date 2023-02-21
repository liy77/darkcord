import {
  ApiItemContainerMixin,
  ApiItemKind
} from "@microsoft/api-extractor-model";
import { memberPredicate } from "./memberPredicate";
import { resolveMembers } from "./resolveMembers";

export function hasMethods(item: ApiItemContainerMixin) {
  return resolveMembers(item, memberPredicate).some(
    ({ item: member }) =>
      member.kind === ApiItemKind.Method ||
      member.kind === ApiItemKind.MethodSignature,
  );
}
