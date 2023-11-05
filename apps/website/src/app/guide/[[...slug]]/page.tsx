import { notFound } from 'next/navigation';
import { allContents } from 'contentlayer/generated';
import { Metadata } from 'next';
import { absoluteUrl } from '~/lib/util';
import { GuidePageHeader } from '~/components/page-header';
import { Mdx } from '~/components/mdx-components';
import { ContentPager } from '~/components/content-pager';

import '~/styles/mdx.css';
import { Separator } from '~/components/ui/separator';

interface ContentRouteParams {
	slug: string[];
}

async function getGuideFromParams(params: ContentRouteParams) {
	const slug = params.slug?.join('/') || '';
	const content = allContents.find((content) => content.slugAsParams === slug);

	if (!content) {
		null;
	}

	return content;
}

export async function generateMetadata({ params }: { params: ContentRouteParams }): Promise<Metadata> {
	const content = await getGuideFromParams(params);

	if (!content) {
		return {};
	}

	return {
		title: content.title,
		description: content.description,
		openGraph: {
			title: content.title,
			description: content.description,
			type: 'article',
			url: absoluteUrl(content.slug),
		},
		twitter: {
			card: 'summary_large_image',
			title: content.title,
			description: content.description,
		},
	};
}

export async function generateStaticParams(): Promise<ContentRouteParams[]> {
	return allContents.map((content) => ({
		slug: content.slugAsParams.split('/'),
	}));
}

export default async function GuidePage({ params }: { params: ContentRouteParams }) {
	const content = await getGuideFromParams(params);

	if (!content) {
		notFound();
	}

	return (
		<article className="relative lg:gap-10 py-2">
			<div className="mx-auto w-full min-w-0">
				<GuidePageHeader heading={content.title} text={content.description} />
				<Mdx code={content.body.code ?? ''} />
				<Separator className="my-4 md:my-6" />
				<ContentPager content={content} />
			</div>
		</article>
	);
}
