import { TableOfContentsSerialized } from "@/components/TableOfContentItems";
import { ApiItemContainerMixin, ApiMethod, ApiMethodSignature } from "@microsoft/api-extractor-model";
import { memberPredicate } from "./memberPredicate";
import { resolveMembers } from "./resolveMembers";

export function serializeMembers(classes: ApiItemContainerMixin): TableOfContentsSerialized[] {
	return resolveMembers(classes, memberPredicate).map(({ item: member }) => {
		if (member.kind === 'Method' || member.kind === 'MethodSignature') {
			return {
				kind: member.kind as 'Method' | 'MethodSignature',
				name: member.displayName,
			};
		} else {
			return {
				kind: member.kind as 'Property' | 'PropertySignature',
				name: member.displayName,
				overloadIndex: (member as ApiMethod | ApiMethodSignature).overloadIndex,
			};
		}
	});
}