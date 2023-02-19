import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import prefetch from '@astrojs/prefetch';
import react from '@astrojs/react';
import { remarkCodeHike } from '@code-hike/mdx';
import unocss from '@unocss/astro';
import compress from 'astro-compress';
import critters from 'astro-critters';
import { defineConfig } from 'astro/config';
import type { Node } from 'hast-util-to-string';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape } from 'html-escaper';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import shikiThemeDarkPlus from 'shiki/themes/dracula-soft.json' assert { type: 'json' };
import { fileURLToPath } from 'url';

const PermaLink = h(
	'svg',
	{
		width: '16',
		height: '16',
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: '#787f85',
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

const rootDir = new URL('../../', rootDir);

export default defineConfig({
	integrations: [
		react(),
		mdx({
			remarkPlugins: [
				[remarkCodeHike, { autoImport: false, theme: shikiThemeDarkPlus, lineNumbers: true, showCopyButton: true }],
			],
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
			configFile: fileURLToPath(new URL('unocss.config.ts', rootDir)),
		}),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
		critters(),
		compress(),
	],
	markdown: {
		syntaxHighlight: false,
	},
	vite: {
		resolve: {
			alias: {
				'ariakit/button': fileURLToPath(new URL('node_modules/ariakit/esm/button/index.js', rootDir)),
				'ariakit/disclosure': fileURLToPath(new URL('node_modules/ariakit/esm/disclosure/index.js', rootDir)),
				'ariakit/separator': fileURLToPath(new URL('node_modules/ariakit/esm/separator/index.js', rootDir)),
				'ariakit/dialog': fileURLToPath(new URL('node_modules/ariakit/esm/dialog/index.js', rootDir)),
				'ariakit-utils/dom': fileURLToPath(new URL('node_modules/ariakit-utils/esm/dom.js', rootDir)),
				'ariakit-utils/events': fileURLToPath(new URL('node_modules/ariakit-utils/esm/events.js', rootDir)),
				'ariakit-utils/focus': fileURLToPath(new URL('node_modules/ariakit-utils/esm/focus.js', rootDir)),
				'ariakit-utils/misc': fileURLToPath(new URL('node_modules/ariakit-utils/esm/misc.js', rootDir)),
				'ariakit-utils/platform': fileURLToPath(new URL('node_modules/ariakit-utils/esm/platform.js', rootDir)),
				'ariakit-react-utils/hooks': fileURLToPath(
					new URL('node_modules/ariakit-react-utils/esm/hooks.js', rootDir),
				),
				'ariakit-react-utils/misc': fileURLToPath(
					new URL('node_modules/ariakit-react-utils/esm/misc.js', rootDir),
				),
				'ariakit-react-utils/system': fileURLToPath(
					new URL('node_modules/ariakit-react-utils/esm/system.js', rootDir),
				),
				'react-use': fileURLToPath(new URL('node_modules/react-use/esm/index.js', rootDir)),
			},
		},
	},
});
