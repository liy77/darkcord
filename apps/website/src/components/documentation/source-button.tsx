'use client';

import { FileCodeIcon } from 'lucide-react';
import { useDocs } from '~/contexts/docs';
import { DocumentationClassMeta } from '~/types/documentation';

interface SourceButtonProps {
	meta?: DocumentationClassMeta;
	path?: string;
}

export function SourceButton({ meta, path }: SourceButtonProps) {
	const { docs } = useDocs();

	const sourceURL = (path: string, file?: string, line?: string | number) => {
		return new URL(`${docs?.tag ?? ''}/${path}${file ? `/${file}` : ''}${line ? `#L${line}` : ''}`, docs?.source).href;
	};

	return (
		<a
			href={meta ? (meta.url ? meta.url : sourceURL(meta.path!, meta.file, meta.line)) : sourceURL(path ?? '')}
			rel="external noopener noreferrer"
			target="_blank"
		>
			<FileCodeIcon />
		</a>
	);
}
