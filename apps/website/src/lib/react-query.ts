import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export enum QueryKeys {
	GetDocs = "GET_DOCS",
	GetPackageReadme = "GET_PACKAGE_README",
	GetPackageVersions = "GET_PACKAGE_VERSIONS",
}
