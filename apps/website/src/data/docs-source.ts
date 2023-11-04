import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface DocsSourceOptions {
	id: string;
	name: string;
	global: string;
	docsRepo: string;
	repo: string;
	source?: string;
	branchFilter?: (branch: string) => boolean;
}

export class DocsSource {
	public id = this.options.id;

	public name = this.options.name;

	public global = this.options.global;

	public docsRepo = this.options.docsRepo;

	public repo = this.options.repo;

	public source = this.options.source ?? `https://github.com/${this.repo}/blob/`;

	public branchFilter = this.options.branchFilter ?? ((branch: string) => branch !== 'main');

	public branches: any[] | null = null;

	public constructor(public readonly options: DocsSourceOptions) {}

	public async fetchDocs() {
		if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
			const res = await readFile(join(process.cwd(), '..', '..', 'packages', 'darkcord', 'docs', 'docs.json'), 'utf8');

			try {
				return JSON.parse(res);
			} catch {
				console.log(res);
				return {};
			}
		}
		// const res = await fetch('', {
		//   next: {
		//     revalidate: 3600
		//   }
		// })

		// return res.json()
	}
}
