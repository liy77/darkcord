'use client';

import { DocumentationClass } from '~/types/documentation';
import { Documentation } from '../documentation/documentation';
import { Header } from '../documentation/header';
import { PropertySection } from '../documentation/section/property-section';
import { MethodSection } from '../documentation/section/method-section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { hasMethods, hasProperties } from '../documentation/util';

export function Class({ clazz }: { readonly clazz: DocumentationClass }) {
	return (
		<Documentation>
			<Header name={clazz.name} description={clazz.description}>
				{/* <SourceButton meta={clazz.meta} /> */}
			</Header>

			{/* Properties */}
			{hasProperties(clazz.props) && (
				<Accordion type="single" collapsible className="flex flex-col space-y-4">
					<AccordionItem value="Properties">
						<AccordionTrigger>
							<h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-4">Properties</h2>
						</AccordionTrigger>

						<AccordionContent>
							<div className="flex flex-col mt-8">
								{clazz.props.map((prop) => (
									<PropertySection key={prop.name} prop={prop} />
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			)}

			{/* Methods */}
			{hasMethods(clazz.methods) && (
				<Accordion type="single" collapsible className="flex flex-col space-y-4">
					<AccordionItem value="Methods">
						<AccordionTrigger>
							<h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-4">Methods</h2>
						</AccordionTrigger>

						<AccordionContent>
							<div className="flex flex-col mt-8">
								{clazz.methods.map((method) => (
									<MethodSection key={method.name} method={method} />
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			)}
		</Documentation>
	);
}
