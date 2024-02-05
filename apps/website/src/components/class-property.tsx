import { DocumentationClassProperty } from "~/types/documentation";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Types } from "./types";
import { ParameterTable } from "./parameter-table";

export function ClassProperty({
	property,
}: {
	property: DocumentationClassProperty;
}) {
	const deprecatedDescription =
		property.deprecated === "string" ? property.deprecated : "";

	return (
		<Card className="mb-8 mx-auto max-w-4xl lg:max-w-full">
			<CardHeader className="flex flex-row items-center">
				<CardTitle className="inline-block mr-2">.{property.name}</CardTitle>
				<span className="space-x-2 text-sm font-semibold uppercase">
					{property.scope === "static" && <Badge>Static</Badge>}

					{property.readonly && <Badge>Read-only</Badge>}

					{property.deprecated && (
						<Badge variant="destructive">Deprecated</Badge>
					)}

					{property.access === "private" && (
						<Badge variant="destructive">Private</Badge>
					)}
				</span>
			</CardHeader>

			<CardContent>
				{property.description && deprecatedDescription && (
					<p className="!mt-1.5 !mb-2.5">{deprecatedDescription}</p>
				)}

				<div className="grid pl-2.5">
					<p className="text-muted-foreground">{property.description}</p>
					{property.props && property.props.length > 0 && (
						<ParameterTable parameters={property.props} />
					)}
					<div className="font-semibold mt-3">
						Type:{" "}
						{property.type.map((type, index) => (
							<Types
								key={index.toString()}
								names={type}
								nullable={property.nullable}
							/>
						))}
					</div>
					{property.default && (
						<div className="mt-3">
							Default: <code>{property.default}</code>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
