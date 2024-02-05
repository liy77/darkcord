import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDocsJSON } from "~/api/get-docs";
import { Documentation } from "~/components/documentation";
import { DocumentationSkeleton } from "~/components/documentation.skeleton";
import { ParameterTable } from "~/components/parameter-table";
import { TypeLink } from "~/components/type-link";
import { Types } from "~/components/types";
import { QueryKeys } from "~/lib/react-query";
import { typeKey } from "~/lib/util";

export default function Page() {
	const { item } = useParams<{ item: string }>();
	if (!item) return null;

	const docsQuery = useQuery({
		queryKey: [QueryKeys.GetDocs],
		queryFn: getDocsJSON,
	});

	const func = docsQuery.data?.functions?.find((c) => c.name === item);

	const returnDescription = (func?.returns as any)[0]?.description;

	console.log(func?.returns);

	return docsQuery.isSuccess && func ? (
		<Documentation
			path="Function"
			description={func.description}
			title={func.name}
			links={{
				githubReference: func.meta?.url ?? undefined,
			}}
		>
			{func.params && func.params.length > 0 && (
				<>
					<h2 className="text-2xl font-semibold mt-8 mb-4">Parameters</h2>
					<ParameterTable parameters={func.params} />
				</>
			)}

			{(func.returns as any) && (
				<>
					<h2 className="text-2xl font-semibold mt-8 mb-4">Returns</h2>
					{func.returns && Array.isArray(func.returns) ? (
						docsQuery.data?.meta.format ?? 0 >= 30 ? (
							Array.isArray(func.returns?.[0]) ? (
								func.returns.map((ret) => (
									<Types
										key={typeKey(ret)}
										names={ret.types}
										variable={ret.variable}
										nullable={ret.nullable}
									/>
								))
							) : (
								<Types key={typeKey(func.returns)} names={func.returns} />
							)
						) : (
							func.returns.map((ret) => (
								<Types key={typeKey(ret)} names={ret} />
							))
						)
					) : (
						<TypeLink type={["void"]} />
					)}

					<div className="mt-3">
						{returnDescription && (
							<span className="text-muted-foreground">{returnDescription}</span>
						)}
					</div>
				</>
			)}
		</Documentation>
	) : (
		<DocumentationSkeleton path="Function" title={item} />
	);
}
