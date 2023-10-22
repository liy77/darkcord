export interface ItemRouteParams {
	item: string;
	version: string;
}

export default async function Page({ params }: { params: ItemRouteParams }) {
	return (
		<div>
			<h1>Item {params.item}</h1>
			<h2>Version {params.version}</h2>
		</div>
	);
}
