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

	const func = docsQuery.data?.functions?.find((c) => c.name === item);

	return docsQuery.isSuccess && func ? (
		<Documentation
			path="Function"
			description={func.description}
			title={func.name}
			links={{
				githubReference: func.meta?.url ?? undefined,
			}}
		>
			...
		</Documentation>
	) : (
		<DocumentationSkeleton path="Function" title={item} />
	);
}
