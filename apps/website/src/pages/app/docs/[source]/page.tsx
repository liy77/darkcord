import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getPackageVersions } from "~/api/get-package-versions";
import { buttonVariants } from "~/components/ui/button";
import { QueryKeys } from "~/lib/react-query";
import { VersionsSkeleton } from "./skeleton";

const versionsSkeletonArray = Array.from({ length: 5 }).fill(null);

export default function Page() {
	const { source } = useParams();

	if (!source) return null;

	const versionQuery = useQuery({
		queryKey: [QueryKeys.GetPackageVersions, source],
		queryFn: async () => getPackageVersions(source),
	});

	return (
		<>
			<h1 className="text-2xl font-semibold">Select a version</h1>
			<div className="flex flex-col gap-4">
				{versionQuery.isSuccess
					? versionQuery.data.map((version, index) => (
							<Link
								key={`${version}-${index.toString()}`}
								to={`/docs/${source}/${version}`}
								className={buttonVariants({ variant: "secondary" })}
							>
								<div className="flex grow flex-row place-content-between place-items-center gap-4">
									<div className="flex flex-row place-content-between place-items-center gap-4">
										<h2 className="font-semibold">{version}</h2>
									</div>
									<ArrowRightIcon className="w-6 h-6" />
								</div>
							</Link>
					  ))
					: versionsSkeletonArray.map((_, index) => (
							<VersionsSkeleton key={index.toString()} />
					  ))}
			</div>
		</>
	);
}
