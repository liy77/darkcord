import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDocsJSON } from "~/api/get-docs";
import { Documentation } from "~/components/documentation";
import { DocumentationSkeleton } from "~/components/documentation.skeleton";
import { QueryKeys } from "~/lib/react-query";

export default function Page() {
	const { item } = useParams<{ item: string }>();
	if (!item) return null;

	const docsQuery = useQuery({
		queryKey: [QueryKeys.GetDocs],
		queryFn: getDocsJSON,
	});

	const typedef = docsQuery.data?.typedefs.find((c) => c.name === item);

	return docsQuery.isSuccess && typedef ? (
		<Documentation
			path="Typedef"
			description={typedef.description}
			title={typedef.name}
			links={{
				githubReference: typedef.meta?.url ?? undefined,
			}}
		>
			...
		</Documentation>
	) : (
		<DocumentationSkeleton path="Typedef" title={item} />
	);
}
