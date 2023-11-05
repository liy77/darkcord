import { FileCodeIcon, MenuIcon } from 'lucide-react';
import { Documentation, DocumentationClassMeta } from '~/types/documentation';

interface SourceButtonProps {
	meta?: DocumentationClassMeta;
	path?: string;
	docs: Documentation;
}

export function SourceButton({ meta, path, docs }: SourceButtonProps) {
	const sourceURL = (path: string, file?: string, line?: string | number) => {
		return new URL(`${docs.tag ?? ''}/${path}${file ? `/${file}` : ''}${line ? `#L${line}` : ''}`, docs.source).href;
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
