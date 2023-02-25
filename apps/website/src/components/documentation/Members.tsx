import { hasMethods } from '@/utils/hasMethods';
import { hasProperties } from '@/utils/hasProperties';
import type { ApiDeclaredItem, ApiItemContainerMixin } from '@/utils/api-extractor-model/src/index';
import { MethodsSection } from './section/MethodsSection';
import { PropertiesSection } from './section/PropertiesSection';

export function Members({ item }: { item: ApiDeclaredItem & ApiItemContainerMixin }) {
	return (
		<>
			{hasProperties(item) ? <PropertiesSection item={item} /> : null}
			{hasMethods(item) ? <MethodsSection item={item} /> : null}
		</>
	);
}
