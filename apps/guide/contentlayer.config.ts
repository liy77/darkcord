import path from 'path';
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { CharsElement, LineElement } from 'rehype-pretty-code';
import { toString } from 'hast-util-to-string';
import rehypeSlug from 'rehype-slug';
import { escape } from 'html-escaper';
import { codeImport } from 'remark-code-import';
import { h } from 'hastscript';
import remarkGfm from 'remark-gfm';
import { getHighlighter, loadTheme } from 'shiki';
import { visit } from 'unist-util-visit';

import { rehypeNpmCommand } from './src/lib/rehype-npm-command';

export const Content = defineDocumentType(() => ({
	name: 'Content',
	filePathPattern: `**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: {
			type: 'string',
			required: true,
		},
		description: {
			type: 'string',
			required: true,
		},
	},
	computedFields: {
		slug: {
			type: 'string',
			resolve: (doc) => doc._raw.flattenedPath.replace(/\d+-/g, ''),
		},
		url: {
			type: 'string',
			resolve: (doc) => `/guide/${doc._raw.flattenedPath.replace(/\d+-/g, '')}`,
		},
	},
}));

const LinkIcon = h(
	'svg',
	{
		width: '24',
		height: '24',
		fill: 'none',
		stroke: '#787f85',
		strokeWidth: '2',
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
	},
	h('path', {
		d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
	}),
	h('path', {
		d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
	}),
);

const createSROnlyLabel = (text: any) => {
	return h('span', { class: 'sr-only' }, `Section titled ${escape(text)}`);
};

export default makeSource({
	contentDirPath: './src/content',
	documentTypes: [Content],
	mdx: {
		remarkPlugins: [remarkGfm, codeImport],
		rehypePlugins: [
			rehypeSlug,
			() => (tree) => {
				visit(tree, (node) => {
					if (node?.type === 'element' && node?.tagName === 'pre') {
						const [codeEl] = node.children;
						if (codeEl.tagName !== 'code') {
							return;
						}

						if (codeEl.data?.meta) {
							const regex = /event="([^"]*)"/;
							const match = codeEl.data?.meta.match(regex);
							if (match) {
								node.__event__ = match ? match[1] : null;
								codeEl.data.meta = codeEl.data.meta.replace(regex, '');
							}
						}

						node.__rawString__ = codeEl.children?.[0].value;
						node.__src__ = node.properties?.__src__;
						node.__style__ = node.properties?.__style__;
					}
				});
			},
			[
				// @ts-ignore
				rehypePrettyCode,
				{
					getHighlighter: async () => {
						const theme = await loadTheme(path.join(process.cwd(), '/src/lib/themes/dark.json'));
						return await getHighlighter({ theme });
					},
					onVisitLine(element: LineElement) {
						if (element.children.length === 0) {
							element.children = [{ type: 'text', value: ' ' }];
						}
					},
					onVisitHighlightedLine(element: LineElement) {
						element.properties.className?.push('line--highlighted');
					},
					onVisitHighlightedChars(element: CharsElement, id: string) {
						element.properties.className?.push('words--highlighted');
						element.properties.id = id;
					},
				},
			],
			() => (tree) => {
				visit(tree, (node) => {
					if (node?.type === 'element' && node?.tagName === 'div') {
						if (!('data-rehype-pretty-code-fragment' in node.properties)) {
							return;
						}

						const preElement = node.children.at(-1);
						if (preElement.tagName !== 'pre') {
							return;
						}

						preElement.properties['__withMeta__'] = node.children.at(0).tagName === 'div';
						preElement.properties['__rawString__'] = node.__rawString__;

						if (node.__src__) {
							preElement.properties['__src__'] = node.__src__;
						}

						if (node.__event__) {
							preElement.properties['__event__'] = node.__event__;
						}
					}
				});
			},
			rehypeNpmCommand,
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className:
							'relative group inline-flex justify-center items-center outline-none pr-2 ml-2 opacity-0 hover:opacity-100',
					},
					behavior: 'append',
					content: (heading: any) => [
						h(
							'span.anchor-icon',
							{
								ariaHidden: 'true',
							},
							LinkIcon,
						),
						createSROnlyLabel(toString(heading)),
					],
				},
			],
		],
	},
});
