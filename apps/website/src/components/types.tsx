import { TypeLink } from "./type-link";

export function Types({
	names,
	nullable,
	variable,
}: {
	names: string | string[] | string[][];
	nullable?: boolean;
	variable?: boolean;
}) {
	return (
		<div className="docs-type inline-block whitespace-pre-wrap">
			<span className="font-semibold">
				{nullable ? "?" : ""}
				{variable ? "..." : ""}
			</span>
			{Array.isArray(names) && (
				<>
					{names.map((name, index) => (
						<TypeLink key={index.toString()} type={name} />
					))}
				</>
			)}
		</div>
	);
}
