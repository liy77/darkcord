import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Typedef } from '~/components/model/typedef';
import { ItemRouteParams, fetchTypedefMember } from '~/util/fetch-member';

export async function generateMetadata({ params }: { params: ItemRouteParams }) {
	const member = await fetchTypedefMember(params);

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
	const member = await fetchTypedefMember(params);

	if (!member) {
		notFound();
	}

	return <Typedef typedef={member} />;
}
