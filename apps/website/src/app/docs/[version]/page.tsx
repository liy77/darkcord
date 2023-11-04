import { readFile } from 'node:fs/promises';
import { VersionRouteParams } from './layout';
import rehypeSlug from 'rehype-slug';
import { join } from 'node:path';
import remarkGfm from 'remark-gfm';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { SyntaxHighlighter } from '~/components/syntax-highlighter';

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

export default async function Page({ params }: { params: VersionRouteParams }) {
	const readmeSource = await loadREADME();

	return (
		<div className="max-w-none prose">
			{/* @ts-expect-error SyntaxHighlighter is assignable */}
			<MDXRemote components={{ pre: SyntaxHighlighter }} options={mdxOptions} source={readmeSource} />
		</div>
	);
}
