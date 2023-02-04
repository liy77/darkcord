interface Props {
	src: string;
	width: number;
	height: number;
	alt: string;
	className?: string | undefined;
}

export function Image({ src, width, height, alt, className }: Props) {
	return (
		<img
			className={`relative rounded shadow-2xl ${className ? className : ''}`}
			src={src}
			width={width}
			height={height}
			alt={alt}
		/>
	);
}
