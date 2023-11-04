import {
	Documentation,
	DocumentationClass,
	DocumentationClassMethod,
	DocumentationInterface,
	DocumentationTypeDefinition,
} from '~/types/documentation';
import { Header } from './header';

export interface ObjectHeaderProps {
	readonly item: DocumentationClass;
}

export function ObjectHeader({ item }: ObjectHeaderProps) {
	return (
		<>
			<Header name={item.name} description={item.description} sourceURL={item.props[0].meta.url}  />
		</>
	);
}
