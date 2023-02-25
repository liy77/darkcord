import { ApiEntryPoint, ApiModel } from "@/utils/api-extractor-model/src/index";

export function findMemberByKey(model: ApiModel, containerKey: string) {
	const pkg = model.tryGetPackageByName("darkcord")!;

	return (pkg.members[0] as ApiEntryPoint).tryGetMemberByKey(containerKey);
}
