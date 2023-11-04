import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Class } from '~/components/model/class';
import { ItemRouteParams, fetchClassMember } from '~/util/fetch-member';

export async function generateMetadata({ params }: { params: ItemRouteParams }) {
	const member = await fetchClassMember(params);

	if (!member) {
		return null;
	}

	return {
		title: member.name,
		description: member.description ?? 'Darkcord API Documentation',
		openGraph: {
			title: member.name,
			description: member.description ?? 'Darkcord API Documentation',
		},
	} satisfies Metadata;
}

export default async function Page({ params }: { params: ItemRouteParams }) {
	const member = await fetchClassMember(params);

	if (!member) {
		notFound();
	}

	return <Class clazz={member} />;
}
