import { TypeLink } from './type-link';
import { typeKey } from './util';

export function Type({ names, nullable, variable }: { readonly names: any; nullable?: boolean; variable?: boolean }) {
	return (
		<div className="docs-type inline-block whitespace-pre-wrap">
			<span className="font-semibold">
				{nullable ? '?' : ''}
				{variable ? '...' : ''}
			</span>
			{Array.isArray(names) ? names.map((name) => <TypeLink key={typeKey(name)} type={name} />) : null}
		</div>
	);
}
