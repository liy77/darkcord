import { Link, useLocation } from "react-router-dom";
import { cn } from "~/lib/util";

export function SidebarNavItem({
	name,
	pathname,
}: { name: string; pathname: string }) {
	const { pathname: currentPathname } = useLocation();

	return (
		<Link
			to={pathname}
			className={cn(
				"group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
				pathname === currentPathname
					? "font-medium text-foreground"
					: "text-muted-foreground",
			)}
		>
			{name}
		</Link>
	);
}
