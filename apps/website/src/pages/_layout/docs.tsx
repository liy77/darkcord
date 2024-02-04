import { Link, Outlet, useLocation } from "react-router-dom";
import { buttonVariants } from "~/components/ui/button";

export default function DocsLayout() {
	const { pathname } = useLocation();

	const previousPath = pathname.split("/").slice(0, -1).join("/");

	return (
		<div className="mx-auto min-h-screen min-w-80 flex justify-center flex-col gap-8 px-4 py-6 sm:w-96 lg:px-6 lg:py-6">
			<Outlet />

			<Link
				className={buttonVariants({ className: "place-self-center" })}
				to={previousPath}
			>
				Go back
			</Link>
		</div>
	);
}
