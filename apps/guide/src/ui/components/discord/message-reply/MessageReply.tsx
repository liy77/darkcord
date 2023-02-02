import type { ReactNode } from 'react';
import { DiscordMessageBaseReply } from '..';

export interface DiscordMessageReplyProps {
	node?: ReactNode | undefined;
	content: string;
}

export function DiscordMessageReply({ content, node }: DiscordMessageReplyProps) {
	return (
		<DiscordMessageBaseReply node={node}>
			<div className="text-dark cursor-pointer select-none text-sm leading-snug text-dark hover:text-white dark:text-[rgb(163_166_170)]">
				{content}
			</div>
		</DiscordMessageBaseReply>
	);
}
