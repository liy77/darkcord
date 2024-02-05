import { DocumentationClassMethod } from "~/types/documentation";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function ClassMethod({ method }: { method: DocumentationClassMethod }) {
	return (
		<Card className="mb-8 mx-auto max-w-4xl lg:max-w-full">
			<CardHeader className="flex flex-row items-center">
				<CardTitle className="inline-block mr-2">.{method.name}</CardTitle>
				<span className="space-x-2 text-sm font-semibold uppercase">
					{method.scope === "static" && <Badge>Static</Badge>}

					{method.abstract && <Badge>Abstract</Badge>}

					{method.deprecated && <Badge variant="destructive">Deprecated</Badge>}

					{method.access === "private" && (
						<Badge variant="destructive">Private</Badge>
					)}
				</span>
			</CardHeader>
		</Card>
	);
}
