import type { PropsWithChildren } from 'react';

function Text({ children }: PropsWithChildren) {
	return (
		<p
			className="font-400 text-dark inline-flex items-center gap-[8px] dark:text-[#787f85]"
			style={{ fontSize: '0.75rem', lineHeight: '1.58333' }}
		>
			{children}
		</p>
	);
}

export function KeyboardComponent({ content }: { content: string }) {
	return (
		<kbd
			className="font-500 text-dark relative top-[-1px] inline-flex min-w-[22px] justify-center whitespace-pre-wrap rounded-[4px] bg-white dark:bg-[#1a1d1e] dark:text-[#9ba1a6]"
			style={{
				padding: '0px 4px',
				lineHeight: '1.61538',
				fontSize: '0.8125rem',
				letterSpacing: '-0.003rem',
				border: '1px solid #3a3f42',
			}}
		>
			{content}
		</kbd>
	);
}

export function CommandFooter() {
	return (
		<div className="flex h-[44px] items-center gap-[16px] pl-[16px]">
			<Text>
				<KeyboardComponent content="↵" />
				<span>to select</span>
			</Text>

			<Text>
				<KeyboardComponent content="↑" />
				<KeyboardComponent content="↓" />

				<span>to navigate</span>
			</Text>

			<Text>
				<KeyboardComponent content="esc" />

				<span>to close</span>
			</Text>
		</div>
	);
}
