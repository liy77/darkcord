import { DocumentationClass } from '~/types/documentation';
import { Documentation } from '../documentation/documentation';
import { Header } from '../documentation/header';
import { PropertiesSection } from '../documentation/section/properties-section';
import { SourceButton } from '../documentation/source-button';

export function Class({ clazz }: { readonly clazz: DocumentationClass }) {
	return (
		<Documentation>
			<Header name={clazz.name} description={clazz.description}>
				{/* <SourceButton meta={clazz.meta} /> */}
			</Header>

			<PropertiesSection prop={clazz.props} />
		</Documentation>
	);
}
