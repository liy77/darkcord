import { ChevronRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/util";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

export function DocumentationSkeleton({
	title,
	path,
}: { title: string; path: string }) {
	return (
		<main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
			<div className="mx-auto w-full min-w-0">
				<div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
					<div className="overflow-hidden text-ellipsis whitespace-nowrap">
						Docs
					</div>
					<ChevronRightIcon className="h-4 w-4" />
					<div className="overflow-hidden text-ellipsis whitespace-nowrap">
						{path}
					</div>
					<ChevronRightIcon className="h-4 w-4" />
					<div className="font-medium text-foreground">{title}</div>
				</div>

				<div className="space-y-2">
					<h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
						{title}
					</h1>
				</div>

				<div className="flex items-center space-x-2 pt-4">
					<Badge variant="secondary" className="gap-1">
						GitHub Reference
						<GitHubLogoIcon className="h-3 w-3" />
					</Badge>
				</div>

				<div className="pb-12 pt-8">
					<Skeleton className="h-6 w-24" />
				</div>
			</div>
		</main>
	);
}
