export function TypeLink({ type }: { type: string | string[] | string[][] }) {
	const typeName = type[0] === 'function' ? 'Function' : type[0];
	// const link = docs?.links[type[0]] ? docs?.links[type[0]] : null;

	return (
		<>
			<span>{typeName}</span>
			{/* {!link && <span>{typeName}</span>} */}
			{/* {typeof link === 'object' && (
				<Link className="text-blue-600" href={link}>
					{typeName}
				</Link>
			)} */}
			{type[1] && <span>{type[1]}</span>}
		</>
	);
}
