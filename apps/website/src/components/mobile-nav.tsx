import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { QueryKeys } from "~/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import { getDocsJSON } from "~/api/get-docs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

export function MobileNav() {
	const [open, setOpen] = useState(false);
	const docsQuery = useQuery({
		queryKey: [QueryKeys.GetDocs],
		queryFn: getDocsJSON,
	});

	const mergedAllMethods = {
		classes: docsQuery.data?.classes ?? [],
		functions: docsQuery.data?.functions ?? [],
		typedefs: docsQuery.data?.typedefs ?? [],
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
				>
					<HamburgerMenuIcon className="h-4 w-4" />
				</Button>
			</SheetTrigger>

			<SheetContent side="left" className="pr-0">
				<Link to="/" className="flex items-center" onClick={() => setOpen}>
					<span className="font-bold">Darkcord</span>
				</Link>

				<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pr-4">
					<div className="flex flex-col space-y-2">
						{docsQuery.isSuccess && (
							<>
								<Accordion type="single" collapsible>
									<AccordionItem value="Classes">
										<AccordionTrigger>Classes</AccordionTrigger>
										<AccordionContent>
											<ul className="space-y-2">
												{mergedAllMethods.classes.map((cls) => (
													<li key={cls.name}>
														<Link
															onClick={() => setOpen(false)}
															className="text-muted-foreground text-xl"
															to={`/docs/darkcord/main/class/${cls.name}`}
														>
															{cls.name}
														</Link>
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
											<ul className="space-y-2">
												{mergedAllMethods.functions.map((fn) => (
													<li key={fn.name}>
														<Link
															onClick={() => setOpen(false)}
															className="text-muted-foreground text-xl"
															to={`/docs/darkcord/main/function/${fn.name}`}
														>
															{fn.name}
														</Link>
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
											<ul className="space-y-2">
												{mergedAllMethods.typedefs.map((typedef) => (
													<li key={typedef.name}>
														<Link
															onClick={() => setOpen(false)}
															className="text-muted-foreground text-xl"
															to={`/docs/darkcord/main/typedef/${typedef.name}`}
														>
															{typedef.name}
														</Link>
													</li>
												))}
											</ul>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</>
						)}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
