import { notFound } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import { allContents } from 'contentlayer/generated';
import Balancer from 'react-wrap-balancer';
import { absoluteUrl, cn } from '~/lib/util';
import { Metadata } from 'next';
import { Mdx } from '~/components/mdx-components';
import { ContentPager } from '~/components/content-pager';

import '~/styles/mdx.css';

interface ContentRouteParams {
	slug: string[];
}

export async function generateMetadata({ params }: { params: ContentRouteParams }): Promise<Metadata> {
  const content = allContents.find((content) => content.slug === params.slug?.join('/'));

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
	return allContents.map((content) => ({ slug: [content.slug] }));
}

export default async function DocPage({ params }: { params: ContentRouteParams }) {
  const content = allContents.find((content) => content.slug === params.slug?.join('/'));

	if (!content) {
		notFound();
	}

	return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Guide
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{content.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {content.title}
          </h1>
          {content.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{content.description}</Balancer>
            </p>
          )}
        </div>
        <div className="pb-12 pt-8">
          <Mdx code={content.body.code ?? ''} />
        </div>
        <ContentPager content={content} />
      </div>
    </main>
  )
}
