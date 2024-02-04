import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { buttonVariants } from "~/components/ui/button";
import { PACKAGES } from "~/util/constants";

export default function Page() {
	return (
		<>
			<h1 className="text-2xl font-semibold">Select a package</h1>
			<div className="flex flex-col gap-4">
				{PACKAGES.map((pkg, index) => (
					<Link
						key={`${pkg}-${index.toString()}`}
						to={`/docs/${pkg}`}
						className={buttonVariants({ variant: "secondary" })}
					>
						<div className="flex grow flex-row place-content-between place-items-center gap-4">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<h2 className="font-semibold">{pkg}</h2>
							</div>
							<ArrowRightIcon className="w-6 h-6" />
						</div>
					</Link>
				))}
			</div>
		</>
	);
}
