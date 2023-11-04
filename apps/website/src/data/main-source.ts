import { DocsSource } from './docs-source';

export default new DocsSource({
	id: 'darkcord',
	name: 'darkcord',
	global: 'darkcord',
	docsRepo: 'darkcord/docs',
	repo: 'JustAWaifuHunter/darkcord',
	branchFilter: (branch) => branch === 'main' || /^v1$/.test(branch),
});
