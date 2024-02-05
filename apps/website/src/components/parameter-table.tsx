import { ParameterUnion } from "~/types/documentation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export function ParameterTable({
	parameters,
}: { parameters: ParameterUnion[] }) {
	const optional = parameters.some((param) => param.optional);
	const parameterDescription = (param: ParameterUnion) =>
		param.description ?? "No description provided.";
	const parameterDefault = (param: ParameterUnion) =>
		param.optional ? <code>{param.default}</code> : <></>;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Parameter</TableHead>
					<TableHead>Type</TableHead>
					{optional && <TableHead>Optional</TableHead>}
					{optional && <TableHead>Default</TableHead>}
					<TableHead>Description</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{parameters.map((param) => (
					<TableRow key={param.name}>
						<TableCell className="!pl-2.5 !py-5">{param.name}</TableCell>
						<TableCell className="!py-5">{param.type}</TableCell>
						{optional && (
							<TableCell className="!py-5">
								{param.optional ? "Yes" : "No"}
							</TableCell>
						)}
						{optional && (
							<TableCell className="!py-5">
								{param.optional && param.default === "undefined" && (
									<em>none</em>
								)}
								{parameterDefault(param)}
							</TableCell>
						)}
						<TableCell className="!py-0">
							{parameterDescription(param)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
