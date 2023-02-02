import type { ReactNode } from 'react';
import { DiscordMessageAuthorReplyProps, DiscordMessageBaseReply } from '..';

export interface DiscordMessageReplyProps {
	author?: DiscordMessageAuthorReplyProps | undefined;
	node?: ReactNode | undefined;
	content: string;
}

export function DiscordMessageReply({ content, author, node }: DiscordMessageReplyProps) {
	return (
		<DiscordMessageBaseReply node={node}>
			<div className="cursor-pointer select-none text-sm leading-snug text-[rgb(163_166_170)] hover:text-white">
				{content}
			</div>
		</DiscordMessageBaseReply>
	);
}
