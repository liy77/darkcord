import { Link, useLocation } from "react-router-dom";

export function TypeLink({ type }: { type: string | string[] | string[][] }) {
	const { pathname } = useLocation();
	const typeName = type[0] === "function" ? "Function" : type[0];
	const link = `/${pathname.split("/").slice(1, 4).join("/")}/${typeName}`;

	return (
		<>
			{!link && <span>{typeName}</span>}

			{typeof link === "object" && (
				<Link to={link} className="text-blue-500 hover:underline">
					{typeName}
				</Link>
			)}

			<Link
				to={link}
				target="_blank"
				rel="noopener"
				className="text-blue-500 hover:underline"
			>
				{typeName}
			</Link>

			{type[1] && <span>{type[1]}</span>}
		</>
	);
}
