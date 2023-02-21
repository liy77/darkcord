import { ApiItem, ApiModel } from "@microsoft/api-extractor-model";

export function findMember(model: ApiModel, memberName: string | undefined): ApiItem | undefined {
	if (!memberName) {
		return undefined;
	}

	const pkg = model.tryGetPackageByName("darkcord")!;
	return pkg.entryPoints[0]?.findMembersByName(memberName)[0];
}