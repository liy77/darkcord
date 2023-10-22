import { UnistNode, UnistTree } from '~/types/unist';
import { visit } from 'unist-util-visit';

export function rehypeNpmCommand() {
	return (tree: UnistTree) => {
		visit(tree, (node: UnistNode) => {
			if (node.type !== 'element' || node?.tagName !== 'pre') {
				return;
			}

			if (node.properties?.['__rawString__']?.startsWith('npm install')) {
				const npmCommand = node.properties?.['__rawString__'];
				node.properties['__npmCommand__'] = npmCommand;
				node.properties['__yarnCommand__'] = npmCommand.replace('npm install', 'yarn add');
				node.properties['__pnpmCommand__'] = npmCommand.replace('npm install', 'pnpm add');
				node.properties['__bunCommand__'] = npmCommand.replace('npm install', 'bun add');
			}
		});
	};
}
