import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

export function VersionsSkeleton() {
	return (
		<Button variant="secondary">
			<div className="flex grow flex-row place-content-between place-items-center gap-4">
				<div className="flex flex-row place-content-between place-items-center gap-4">
					<Skeleton className="w-24 h-6" />
				</div>

				<ArrowRightIcon className="w-6 h-6" />
			</div>
		</Button>
	);
}
