import { ApiEntryPoint, ApiModel } from "@microsoft/api-extractor-model";

export function findMemberByKey(model: ApiModel, containerKey: string) {
	const pkg = model.tryGetPackageByName("darkcord")!;

	return (pkg.members[0] as ApiEntryPoint).tryGetMemberByKey(containerKey);
}