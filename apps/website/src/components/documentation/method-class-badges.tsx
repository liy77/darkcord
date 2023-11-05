import { DocumentationClassMethod } from '~/types/documentation';
import { Badge } from '../ui/badge';

export function MethodClassBadges({ item }: { readonly item: DocumentationClassMethod }) {
	return (
		<span className="space-x-2 text-gray-200 text-sm font-semibold uppercase pt-6">
			{item.scope === 'static' && <Badge variant="secondary">Static</Badge>}

			{item.abstract && <Badge>Abstract</Badge>}

			{item.deprecated && <Badge variant="destructive">Deprecated</Badge>}

			{item.access === 'private' && <Badge variant="destructive">Private</Badge>}
		</span>
	);
}
