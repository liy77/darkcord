import { ReactNode } from 'react';
import { DiscordMessageAuthorReplyProps } from './discord-message-author-reply';
import { DiscordMessageBaseReply } from './discord-message-base-reply';

export interface DiscordMessageReplyProps {
	readonly author?: DiscordMessageAuthorReplyProps | undefined;
	readonly authorNode?: ReactNode | undefined;
	readonly content: string;
}

export function DiscordMessageReply({ author, authorNode, content }: DiscordMessageReplyProps) {
	return (
		<DiscordMessageBaseReply author={author} authorNode={authorNode}>
			<div className="cursor-pointer select-none text-sm leading-snug text-[rgb(163_166_170)] hover:text-white">
				{content}
			</div>
		</DiscordMessageBaseReply>
	);
}
