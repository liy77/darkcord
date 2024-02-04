import { env } from "~/env";

export async function getPackageVersions(_packageName: string) {
	if (env.MODE !== "production") {
		return ["main"];
	}

	return [];
}
