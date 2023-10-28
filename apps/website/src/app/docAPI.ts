import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function fetchModelJSON(version: string): Promise<unknown> {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
		console.log(version);
		const res = await readFile(join(process.cwd(), '..', '..', 'packages', 'darkcord', 'docs', 'docs.json'), 'utf8');

		try {
			return JSON.parse(res);
		} catch {
			console.log(res);
			return {};
		}
	}
}
