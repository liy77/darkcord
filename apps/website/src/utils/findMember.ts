import { ApiItem, ApiModel } from "@/utils/api-extractor-model/src/index";

export function findMember(model: ApiModel, memberName: string | undefined): ApiItem | undefined {
	if (!memberName) {
		return undefined;
	}

	const pkg = model.tryGetPackageByName("darkcord")!;
	return pkg.entryPoints[0]?.findMembersByName(memberName)[0];
}
