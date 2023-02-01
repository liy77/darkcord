import { FiExternalLink } from 'react-icons/fi';

interface ExternalLinkProps {
	href: string;
	title: string;
}

export function ExternalLink({ href, title }: ExternalLinkProps) {
	return (
		<a className="inline-flex place-items-center gap-2 text-sm font-semibold" href={href}>
			<FiExternalLink size={18} />
			<p>{title}</p>
		</a>
	);
}
