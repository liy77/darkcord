import { useMemo } from 'react';
import { ParameterUnion } from '~/types/documentation';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function ParameterTable({ params }: { readonly params: ParameterUnion[] }) {
	const rows = useMemo(
		() =>
			params.map((param) => (
        <TableRow key={param.name}>
           <TableCell key={param.name}>
          {param.name}
        </TableCell>

        <TableCell>
          {param.type}
        </TableCell>

        <TableCell>
          {param.optional ? 'Yes' : 'No'}
        </TableCell>

        <TableCell>
          {param.description}
        </TableCell>
        </TableRow>
      )),
		[params],
	);

  return (
    <Table>
      <TableCaption>Method Parameters</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Optional</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows}
      </TableBody>
    </Table>
  )
}
