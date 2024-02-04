import { ChevronRightIcon } from "@radix-ui/react-icons";
import { PropsWithChildren } from "react";
import { cn } from "~/lib/util";

export function Documentation({
	title,
	children,
}: PropsWithChildren<{ title: string }>) {
	return (
		<main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
			<div className="mx-auto w-full min-w-0">
				<div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
					<div className="overflow-hidden text-ellipsis whitespace-nowrap">
						Docs
					</div>
					<ChevronRightIcon className="h-4 w-4" />
					<div className="font-medium text-foreground">{title}</div>
				</div>

				<div className="space-y-2">
					<h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
						{title}
					</h1>
				</div>

				<div className="pb-12 pt-8">{children}</div>
			</div>
		</main>
	);
}
