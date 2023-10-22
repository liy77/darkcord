import { readFile } from 'node:fs/promises';
import { VersionRouteParams } from './layout';
import rehypeSlug from 'rehype-slug';
import { join } from 'node:path';
import remarkGfm from 'remark-gfm';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { HTMLAttributes } from 'react';
import { cn } from '~/lib/util';

async function loadREADME(packageName: string) {
	return readFile(join(process.cwd(), '..', '..', 'packages', packageName, 'README.md'));
}

export default async function Page({ params }: { params: VersionRouteParams }) {
	const readmeSource = await loadREADME('darkcord');
	console.log(params);

	return (
		<div className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
			<div className="mx-auto w-full min-w-0">
				<MDXRemote
					components={{
						a: ({ className, ...props }: HTMLAttributes<HTMLAnchorElement>) => (
							<a
								className={cn('font-medium underline underline-offset-4', className)}
								target="_blank"
								rel="noopener noreferrer"
								{...props}
							/>
						),
						pre: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
							<pre
								className={cn(
									'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900',
									className,
								)}
								{...props}
							/>
						),
						code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
							<code
								className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm', className)}
								{...props}
							/>
						),
					}}
					options={{
						mdxOptions: {
							remarkPlugins: [remarkGfm],
							remarkRehypeOptions: { allowDangerousHtml: true },
							rehypePlugins: [rehypeSlug],
							format: 'md',
						},
					}}
					source={readmeSource}
				/>
			</div>
		</div>
	);
}
