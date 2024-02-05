import { FileIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { DocumentationClassMeta } from "~/types/documentation";

export function SourceButton({ meta }: { meta: DocumentationClassMeta }) {
	const sourceURL = meta.url ?? "";

	return (
		<Link
			to={sourceURL}
			target="_blank"
			rel="noopener"
			aria-label="Go to source"
		>
			<FileIcon className="w-4 h-4" />
		</Link>
	);
}
