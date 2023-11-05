import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Function } from '~/components/model/function';
import { Typedef } from '~/components/model/typedef';
import { ItemRouteParams, fetchFunctionMember, fetchTypedefMember } from '~/util/fetch-member';

export async function generateMetadata({ params }: { params: ItemRouteParams }) {
	const member = await fetchFunctionMember(params);

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
	const member = await fetchFunctionMember(params);

	if (!member) {
		notFound();
	}

	return <Function func={member} />;
}
