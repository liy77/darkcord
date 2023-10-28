import { ReactNode } from 'react';
import { DiscordMessageAuthorReplyProps } from './discord-message-author-reply';
import { DiscordMessageBaseReply } from './discord-message-base-reply';

export interface DiscordMessageInteractionProps {
	readonly author?: DiscordMessageAuthorReplyProps | undefined;
	readonly authorNode?: ReactNode | undefined;
	readonly command?: string;
}

export function DiscordMessageInteraction({ author, authorNode, command }: DiscordMessageInteractionProps) {
	return (
		<DiscordMessageBaseReply author={author} authorNode={authorNode}>
			<span className="mr-1 select-none text-sm leading-snug text-white">used</span>
			<div className="cursor-pointer text-sm leading-snug text-[#5865F2] hover:underline">{command}</div>
		</DiscordMessageBaseReply>
	);
}
