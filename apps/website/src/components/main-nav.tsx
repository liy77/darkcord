import { Link, useLocation } from "react-router-dom";
import { cn } from "~/lib/util";

export function MainNav() {
	const { pathname } = useLocation();

	return (
		<div className="mr-4 hidden md:flex">
			<Link to="/" className="mr-6 flex items-center space-x-2">
				<span className="hidden font-bold sm:inline-block">Darkcord</span>
			</Link>

			<nav className="flex items-center gap-6 text-sm">
				<Link
					to="/docs"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/docs" ? "text-foreground" : "text-foreground/60",
					)}
				>
					Docs
				</Link>

				<Link
					to="https://github.com/JustAWaifuHunter/darkcord"
					target="_blank"
					rel="noreferrer"
					className={cn(
						"hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block",
					)}
				>
					GitHub
				</Link>
			</nav>
		</div>
	);
}
