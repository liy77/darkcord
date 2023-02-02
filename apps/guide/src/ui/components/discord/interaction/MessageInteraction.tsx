import type { ReactNode } from 'react';
import { DiscordMessageBaseReply, type DiscordMessageAuthorReplyProps } from '..';

export interface DiscordMessageInteractionProps {
	author?: DiscordMessageAuthorReplyProps | undefined;
	node?: ReactNode | undefined;
	command?: string;
}

export function DiscordMessageInteraction({ author, node, command }: DiscordMessageInteractionProps) {
	return (
		<DiscordMessageBaseReply author={author} node={node}>
			<span className="mr-1 select-none text-sm leading-snug dark:text-white text-dark">used</span>
			<div className="text-blue-5 cursor-pointer text-sm leading-snug hover:underline">{command}</div>
		</DiscordMessageBaseReply>
	);
}
