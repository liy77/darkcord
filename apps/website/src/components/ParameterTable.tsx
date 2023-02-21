import type { ApiParameterListMixin } from '@microsoft/api-extractor-model';
import { useMemo } from 'react';
import { Table } from './documentation/Table';
import { TSDoc } from './documentation/tsdoc/TSDoc';

const columnStyles = {
	Name: 'whitespace-nowrap',
	Type: 'whitespace-pre-wrap break-normal',
};

export function ParameterTable({ item }: { item: ApiParameterListMixin }) {
	const rows = useMemo(
		() =>
			item.parameters.map((param) => ({
				Name: param.name,
				Optional: param.isOptional ? 'Yes' : 'No',
				Description: param.tsdocParamBlock ? <TSDoc item={item} tsdoc={param.tsdocParamBlock.content} /> : 'None',
			})),
		[item],
	);

	return (
		<div className="overflow-x-auto">
			<Table columnStyles={columnStyles} columns={['Name', 'Optional', 'Description']} rows={rows} />
		</div>
	);
}