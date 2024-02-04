import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDocsJSON } from "~/api/get-docs";
import { Documentation } from "~/components/documentation";
import { QueryKeys } from "~/lib/react-query";

export default function Page() {
	const { item } = useParams<{ item: string }>();
	const docsQuery = useQuery({
		queryKey: [QueryKeys.GetDocs],
		queryFn: getDocsJSON,
	});

	const clazz = docsQuery.data?.classes.find((c) => c.name === item);

	if (!clazz) {
		return <div>Class not found.</div>;
	}

	return docsQuery.isSuccess ? (
		<Documentation title={clazz.name}>{clazz.description}</Documentation>
	) : null;
}
