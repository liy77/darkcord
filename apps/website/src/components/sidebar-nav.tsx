import { useQuery } from "@tanstack/react-query";
import { getDocsJSON } from "~/api/get-docs";
import { QueryKeys } from "~/lib/react-query";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import { SidebarNavItem } from "./sidebar-nav-item";

export function DocsSidebarNav() {
	const docsQuery = useQuery({
		queryKey: [QueryKeys.GetDocs],
		queryFn: getDocsJSON,
	});

	const mergedAllMethods = {
		classes: docsQuery.data?.classes ?? [],
		functions: docsQuery.data?.functions ?? [],
		typedefs: docsQuery.data?.typedefs ?? [],
	};

	return docsQuery.isSuccess ? (
		<div className="w-full space-y-8">
			<Accordion type="single" collapsible>
				<AccordionItem value="Classes">
					<AccordionTrigger>Classes</AccordionTrigger>
					<AccordionContent>
						<ul>
							{mergedAllMethods.classes.map((cls) => (
								<li key={cls.name}>
									<SidebarNavItem
										name={cls.name}
										pathname={`/docs/darkcord/main/class/${cls.name}`}
									/>
								</li>
							))}
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<Accordion type="single" collapsible>
				<AccordionItem value="Functions">
					<AccordionTrigger>Functions</AccordionTrigger>
					<AccordionContent>
						<ul>
							{mergedAllMethods.functions.map((fn) => (
								<li key={fn.name}>
									<SidebarNavItem
										name={fn.name}
										pathname={`/docs/darkcord/main/function/${fn.name}`}
									/>
								</li>
							))}
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<Accordion type="single" collapsible>
				<AccordionItem value="Typedefs">
					<AccordionTrigger>Typedefs</AccordionTrigger>
					<AccordionContent>
						<ul>
							{mergedAllMethods.typedefs.map((td) => (
								<li key={td.name}>
									<SidebarNavItem
										name={td.name}
										pathname={`/docs/darkcord/main/typedef/${td.name}`}
									/>
								</li>
							))}
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	) : null;
}
