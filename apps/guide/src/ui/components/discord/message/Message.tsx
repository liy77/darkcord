import type { PropsWithChildren, ReactNode } from 'react';
import {
	DiscordMessageAuthor,
	DiscordMessageInteraction,
	DiscordMessageReply,
	type DiscordMessageAuthorProps,
	type DiscordMessageInteractionProps,
	type DiscordMessageReplyProps
} from '..';

export interface DiscordMessageProps {
	author?: DiscordMessageAuthorProps | undefined;
	node?: ReactNode | undefined;
	followUp?: boolean;
	interaction?: DiscordMessageInteractionProps | undefined;
	interactionNode?: ReactNode | undefined;
	reply?: DiscordMessageReplyProps | undefined;
	replyNode?: ReactNode | undefined;
}

export function DiscordMessage({
	author,
	node,
	children,
	followUp,
	interaction,
	interactionNode,
	reply,
	replyNode,
}: PropsWithChildren<DiscordMessageProps>) {
	return (
		<div className="font-source-sans-pro pt-0.1 bg-[rgb(54_57_63)] pb-4 rounded">
			<div className="relative">
				<div className="pl-18 hover:bg-[rgb(4_4_5)]/7 group py-0.5 pr-12 leading-snug">
					{(reply || replyNode) && !followUp ? reply ? <DiscordMessageReply {...reply} /> : replyNode ?? null : null}
					{(interaction || interactionNode) && !(reply || replyNode) && !followUp ? (
						interaction ? (
							<DiscordMessageInteraction {...interaction} />
						) : (
							interactionNode ?? null
						)
					) : null}
					<div className="static">
						{followUp ? (
							<span className="h-5.5 absolute left-0 mr-1 hidden w-[56px] cursor-default select-none text-right text-xs leading-loose text-[rgb(163_166_170)] group-hover:inline-block">
								Today at{' '}
								{new Date().toLocaleTimeString('en-US', {
									hour: 'numeric',
									minute: 'numeric',
									hour12: false,
								})}
							</span>
						) : author ? (
							<DiscordMessageAuthor {...author} />
						) : (
							node
						)}
						<div className="text-white [&>p]:m-0 [&>p]:leading-snug">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
