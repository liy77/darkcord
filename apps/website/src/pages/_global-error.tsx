import { useRouteError } from "react-router-dom";

export default function GlobalError() {
	const error = useRouteError() as Error;
	console.error(error);

	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<h1 className="text-4xl font-bold">500</h1>
		</div>
	);
}
