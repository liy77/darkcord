import { DocumentationClass, DocumentationClassProperty } from '~/types/documentation';
import { Type } from '../type';

export function PropertiesSection({ prop }: { readonly prop: DocumentationClassProperty[] }) {
	console.log(prop);
	return (
		<div className="flex flex-col space-x-4">
			<h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-4">Properties</h2>

			<div className="flex flex-col mt-8">
				{prop.map((item, idx) => (
					<div key={idx} className="flex flex-col mb-4">
						<div className="border rounded p-5">
							<h3 className="scroll-m-20 text-xl font-semibold tracking-tight mr-2 space-x-2">
								<span>{`${item.name}${item.optional ? '?' : ''}`}</span>
								<span>:</span>
								{item.type.map((type, idx) => (
									<Type key={idx} names={type} />
								))}
							</h3>

							<div className="pl-2.5 pt-2.5">
								<p className="leading-7 [&:not(:first-child)]:mt-6 font-medium">{item.description}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
