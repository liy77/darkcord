import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import prefetch from '@astrojs/prefetch';
import react from '@astrojs/react';
import unocss from '@unocss/astro';
import compress from 'astro-compress';
import critters from 'astro-critters';
import { defineConfig } from 'astro/config';
import { toString, type Node } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape } from 'html-escaper';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

const PermaLink = h(
	'svg',
	{
		width: '16',
		height: '16',
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
	},
	h('path', {
		d: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71',
	}),
	h('path', {
		d: 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
	}),
);

const createSROnlyLabel = (text: string) => {
	const node = h('span.sr-only', `Section titled ${escape(text)}`);
	node.properties!['is:raw'] = true;
	return node;
};

export default defineConfig({
	integrations: [
		react(),
		mdx({
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						properties: {
							class:
								'relative inline-flex w-6 h-6 place-items-center place-content-center outline-0 text-black dark:text-white ml-2',
						},
						behavior: 'after',
						group: ({ tagName }: { tagName: string }) =>
							h('div', {
								class: `[&>*]:inline-block [&>h1]:m-0 [&>h2]:m-0 [&>h3]:m-0 [&>h4]:m-0 level-${tagName}`,
								tabIndex: -1,
							}),
						content: (heading: Node) => [
							h(
								`span.anchor-icon`,
								{
									ariaHidden: 'true',
								},
								PermaLink,
							),
							createSROnlyLabel(toString(heading)),
						],
					},
				],
			],
		}),
		prefetch({
			throttle: 3,
		}),
		unocss({
			configFile: 'unocss.config.ts',
		}),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
		critters(),
		compress(),
	],
});
