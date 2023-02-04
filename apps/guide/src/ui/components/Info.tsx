import { PropsWithChildren } from 'react';

function Icon() {
	return (
		<svg
			viewBox="0 0 20 20"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5 flex-none text-zinc-400 dark:text-zinc-300"
			aria-label="Info"
		>
			<path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 14.5C4.41563 14.5 1.5 11.5841 1.5 8C1.5 4.41594 4.41563 1.5 8 1.5C11.5844 1.5 14.5 4.41594 14.5 8C14.5 11.5841 11.5844 14.5 8 14.5ZM9.25 10.5H8.75V7.75C8.75 7.3375 8.41563 7 8 7H7C6.5875 7 6.25 7.3375 6.25 7.75C6.25 8.1625 6.5875 8.5 7 8.5H7.25V10.5H6.75C6.3375 10.5 6 10.8375 6 11.25C6 11.6625 6.3375 12 6.75 12H9.25C9.66406 12 10 11.6641 10 11.25C10 10.8359 9.66563 10.5 9.25 10.5ZM8 6C8.55219 6 9 5.55219 9 5C9 4.44781 8.55219 4 8 4C7.44781 4 7 4.44687 7 5C7 5.55313 7.44687 6 8 6Z"></path>
		</svg>
	);
}

export function Info({ children }: PropsWithChildren) {
	return (
		<div className="mb-4 min-h-[54px] overflow-hidden rounded-xl border border-zinc-500/20 bg-zinc-50/50 px-5 py-4 dark:border-zinc-500/30 dark:bg-zinc-900 dark:bg-zinc-500/10">
			<div className="flex items-start space-x-3">
				<div className="mt-0.5 w-4">
					<Icon />
				</div>

				<div className="prose flex-1 overflow-x-auto text-sm text-zinc-900 dark:text-zinc-200">{children}</div>
			</div>
		</div>
	);
}
