import { EditIcon, iconSize } from '@expo/styleguide';

interface ExternalLinkProps {
	href: string;
	title: string;
}

export function ExternalLink({ href, title }: ExternalLinkProps) {
	return (
		<a className="inline-flex place-items-center gap-2 text-sm font-semibold" href={href}>
			<EditIcon size={iconSize.sm} color="currentColor" />
			<p>{title}</p>
		</a>
	);
}
