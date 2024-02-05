import { ChevronRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { PropsWithChildren } from "react";
import { cn } from "~/lib/util";
import Balancer from "react-wrap-balancer";
import { Link } from "react-router-dom";
import { badgeVariants } from "./ui/badge";

interface LinkProps {
	githubReference?: string;
}

export function Documentation({
	title,
	path,
	children,
	description,
	links,
}: PropsWithChildren<{
	title: string;
	path: string;
	description?: string;
	links?: LinkProps;
}>) {
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
					{description && (
						<p className="text-lg text-muted-foreground">
							<Balancer>{description}</Balancer>
						</p>
					)}
				</div>

				{links ? (
					<div className="flex items-center space-x-2 pt-4">
						{links.githubReference && (
							<Link
								to={links.githubReference}
								target="_blank"
								rel="noreferrer"
								className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
							>
								GitHub
								<GitHubLogoIcon className="h-3 w-3" />
							</Link>
						)}
					</div>
				) : null}

				<div className="pb-12 pt-8">{children}</div>
			</div>
		</main>
	);
}
