import { PropsWithChildren } from 'react';

function Icon() {
	return (
		<svg
			className="h-5 w-5 flex-none text-amber-400 dark:text-amber-300/80"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			aria-label="Warning"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			></path>
		</svg>
	);
}

export function Warning({ children }: PropsWithChildren) {
	return (
		<div className="mb-4 min-h-[54px] overflow-hidden rounded-xl border border-amber-500/20 bg-amber-50/50 px-5 py-1.5 dark:border-amber-500/30 dark:bg-amber-500/10">
			<div className="flex items-start items-center space-x-3">
				<div className="mt-0.5 w-4">
					<Icon />
				</div>

				<div className="prose flex-1 overflow-x-auto text-sm text-amber-900 dark:text-amber-200">
					<p>{children}</p>
				</div>
			</div>
		</div>
	);
}
