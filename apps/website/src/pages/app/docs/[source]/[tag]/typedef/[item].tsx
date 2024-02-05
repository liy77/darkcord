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

	const typedef = docsQuery.data?.typedefs.find((c) => c.name === item);
	const returnDescription = (typedef?.returns as any)?.[0]?.description;

	return docsQuery.isSuccess && typedef ? (
		<Documentation
			path="Typedef"
			description={typedef.description}
			title={typedef.name}
			links={{
				githubReference: typedef.meta?.url ?? undefined,
			}}
		>
			{typedef.type && (
				<>
					<h2 className="text-2xl font-semibold mt-8 mb-4">Types</h2>
					<ul>
						{typedef.type.map((type) => (
							<li key={typeKey(type)}>
								<Types names={type} />
							</li>
						))}
					</ul>
				</>
			)}

			{typedef.props?.length && (
				<>
					<h2 className="text-2xl font-semibold mt-8 mb-4">Properties</h2>
					<ParameterTable parameters={typedef.props} />
				</>
			)}

			{typedef.params?.length && (
				<>
					<h2 className="text-2xl font-semibold mt-8 mb-4">Parameters</h2>
					<ParameterTable parameters={typedef.params} />
				</>
			)}

			{(typedef.returns as any) && (
				<>
					<h2 className="text-2xl font-semibold mt-8 mb-4">Returns</h2>
					{typedef.returns && Array.isArray(typedef.returns) ? (
						docsQuery.data?.meta.format ?? 0 >= 30 ? (
							Array.isArray(typedef.returns?.[0]) ? (
								typedef.returns.map((ret) => (
									<Types
										key={typeKey(ret)}
										names={ret.types}
										variable={ret.variable}
										nullable={ret.nullable}
									/>
								))
							) : (
								<Types key={typeKey(typedef.returns)} names={typedef.returns} />
							)
						) : (
							typedef.returns.map((ret) => (
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
		<DocumentationSkeleton path="Typedef" title={item} />
	);
}
