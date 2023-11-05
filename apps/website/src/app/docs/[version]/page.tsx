import { readFile } from 'node:fs/promises';
import { VersionRouteParams } from './layout';
import rehypeSlug from 'rehype-slug';
import { join } from 'node:path';
import remarkGfm from 'remark-gfm';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { SyntaxHighlighter } from '~/components/syntax-highlighter';
import { HTMLAttributes } from 'react';

async function loadREADME() {
	return readFile(join(process.cwd(), '..', '..', 'packages', 'darkcord', 'README.md'));
}

const mdxOptions = {
	mdxOptions: {
		remarkPlugins: [remarkGfm],
		remarkRehypeOptions: { allowDangerousHtml: true },
		rehypePlugins: [rehypeSlug],
		format: 'md',
	},
};

const components = {
	pre: SyntaxHighlighter,
	h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
		<h2 {...props} className="scroll-m-20 border-b mb-2 mt-4 pb-2 text-3xl font-semibold tracking-tight first:mt-0" />
	),
	h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
		<h3 {...props} className="scroll-m-20 text-2xl mt-4 font-semibold tracking-tight" />
	),
	h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
		<h4 {...props} className="scroll-m-20 text-xl mt-4 font-semibold tracking-tight" />
	),
	h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
		<h5 {...props} className="scroll-m-20 text-lg mt-4 font-semibold tracking-tight" />
	),
	p: (props: HTMLAttributes<HTMLParagraphElement>) => <p {...props} className="leading-7 [&:not(:first-child)]:mt-6" />,
	a: (props: HTMLAttributes<HTMLAnchorElement>) => (
		<a {...props} className="text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors duration-300" />
	),
	img: (props: HTMLAttributes<HTMLImageElement>) => <img {...props} className="max-w-full" />,
};

export default async function Page({ params }: { params: VersionRouteParams }) {
	const readmeSource = await loadREADME();

	return (
		<div className="max-w-none prose">
			{/* @ts-expect-error SyntaxHighlighter is assignable */}
			<MDXRemote components={components} options={mdxOptions} source={readmeSource} />
		</div>
	);
}
