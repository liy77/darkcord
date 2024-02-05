import { Link } from "react-router-dom";
import { MainNav } from "./main-nav";
import { cn } from "~/lib/util";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { DocsSearcher } from "./docs-searcher";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<MainNav />
				<MobileNav />
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						<DocsSearcher />
					</div>

					<nav className="flex items-center">
						<Link
							to="https://github.com/JustAWaifuHunter/darkcord"
							target="_blank"
							rel="noreferrer"
						>
							<div
								className={cn(
									buttonVariants({
										variant: "ghost",
									}),
									"w-9 px-0",
								)}
							>
								<GitHubLogoIcon className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</div>
						</Link>
						<ThemeSwitcher />
					</nav>
				</div>
			</div>
		</header>
	);
}
