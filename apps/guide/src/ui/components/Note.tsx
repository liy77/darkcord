import { PropsWithChildren } from 'react';

function Icon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4 text-sky-500"
			aria-label="Note"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7 1.3C10.14 1.3 12.7 3.86 12.7 7C12.7 10.14 10.14 12.7 7 12.7C5.48908 12.6974 4.0408 12.096 2.97241 11.0276C1.90403 9.9592 1.30264 8.51092 1.3 7C1.3 3.86 3.86 1.3 7 1.3ZM7 0C3.14 0 0 3.14 0 7C0 10.86 3.14 14 7 14C10.86 14 14 10.86 14 7C14 3.14 10.86 0 7 0ZM8 3H6V8H8V3ZM8 9H6V11H8V9Z"
			></path>
		</svg>
	);
}

export function Note({ children }: PropsWithChildren) {
	return (
		<div className="mb-4 min-h-[54px] overflow-hidden rounded-xl border border-sky-500/20 bg-sky-50/50 px-5 py-1.5 dark:border-sky-500/30 dark:bg-sky-500/10">
			<div className="flex items-start items-center space-x-3">
				<div className="mt-0.5 w-4">
					<Icon />
				</div>

				<div className="prose flex-1 overflow-x-auto text-sm text-sky-900 dark:text-sky-200">
					<p>{children}</p>
				</div>
			</div>
		</div>
	);
}
