import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDocsJSON } from "~/api/get-docs";
import { ClassMethod } from "~/components/class-method";
import { ClassProperty } from "~/components/class-property";
import { Documentation } from "~/components/documentation";
import { DocumentationSkeleton } from "~/components/documentation.skeleton";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { QueryKeys } from "~/lib/react-query";
import {
	DocumentationClassMethod,
	DocumentationClassProperty,
} from "~/types/documentation";
import { IS_SHOW_PRIVATES } from "~/util/constants";

function parseProperties(props: DocumentationClassProperty[]) {
	if (!props) return null;

	let filtered = props;
	if (!IS_SHOW_PRIVATES) {
		filtered = filtered.filter((prop) => prop.access !== "private");
	}

	return filtered.sort((a, b) =>
		`${a.scope === "static" ? "ZZZ" : ""}${a.name}`.localeCompare(
			`${b.scope === "static" ? "ZZZ" : ""}${b.name}`,
		),
	);
}

function parseMethods(methods: DocumentationClassMethod[]) {
	if (!methods) return null;

	let filtered = methods;
	if (!IS_SHOW_PRIVATES) {
		filtered = filtered.filter((method) => method.access !== "private");
	}

	return filtered.sort((a, b) =>
		`${a.scope === "static" ? "ZZZ" : ""}${a.name}`.localeCompare(
			`${b.scope === "static" ? "ZZZ" : ""}${b.name}`,
		),
	);
}

export default function Page() {
	const { item } = useParams<{ item: string }>();
	if (!item) return null;

	const docsQuery = useQuery({
		queryKey: [QueryKeys.GetDocs],
		queryFn: getDocsJSON,
	});

	const clazz = docsQuery.data?.classes.find((c) => c.name === item);

	const properties = parseProperties(clazz?.props ?? []);
	const methods = parseMethods(clazz?.methods ?? []);

	return docsQuery.isSuccess && clazz ? (
		<Documentation
			path="Class"
			description={clazz.description}
			title={clazz.name}
			links={{
				githubReference: clazz.meta?.url ?? undefined,
			}}
		>
			{properties?.length ? (
				<Accordion type="single" collapsible>
					<AccordionItem value="properties">
						<AccordionTrigger>
							<h2 className="text-2xl font-semibold mt-8 mb-4">Properties</h2>
						</AccordionTrigger>

						<AccordionContent>
							{properties.map((prop) => (
								<ClassProperty key={prop.name} property={prop} />
							))}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			) : null}

			{methods?.length ? (
				<Accordion type="single" collapsible>
					<AccordionItem value="methods">
						<AccordionTrigger>
							<h2 className="text-2xl font-semibold mt-8 mb-4">Methods</h2>
						</AccordionTrigger>

						<AccordionContent>
							{methods.map((method) => (
								<ClassMethod key={method.name} method={method} />
							))}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			) : null}
		</Documentation>
	) : (
		<DocumentationSkeleton path="Class" title={item} />
	);
}
