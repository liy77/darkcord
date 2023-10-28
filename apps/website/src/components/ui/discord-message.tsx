import { PropsWithChildren, ReactNode } from 'react';
import { DiscordMessageReply, DiscordMessageReplyProps } from './discord-message-reply';
import { DiscordMessageInteraction, DiscordMessageInteractionProps } from './discord-message-interaction';
import { DiscordMessageAuthor, DiscordMessageAuthorProps } from './discord-message-author';
import { cn } from '~/lib/util';

export interface DiscordMessageProps {
	readonly author?: DiscordMessageAuthorProps | undefined;
	readonly authorNode?: ReactNode | undefined;
	readonly followUp?: boolean;
	readonly interaction?: DiscordMessageInteractionProps | undefined;
	readonly interactionNode?: ReactNode | undefined;
	readonly reply?: DiscordMessageReplyProps | undefined;
	readonly replyNode?: ReactNode | undefined;
}

export function DiscordMessage({
	author,
	authorNode,
	children,
	followUp,
	interaction,
	interactionNode,
	reply,
	replyNode,
}: PropsWithChildren<DiscordMessageProps>) {
	return (
		<div className="relative" id="outer-message-wrapper">
			<div
				className={cn('pl-18 hover:bg-[rgb(4_4_5)]/7 group py-0.5 pr-12 leading-snug', followUp ? '' : 'mt-4')}
				id="message-wrapper"
			>
				{(reply || replyNode) && !followUp ? reply ? <DiscordMessageReply {...reply} /> : replyNode ?? null : null}
				{(interaction || interactionNode) && !(reply || replyNode) && !followUp ? (
					interaction ? (
						<DiscordMessageInteraction {...interaction} />
					) : (
						interactionNode ?? null
					)
				) : null}
				<div className="static" id="content-wrapper">
					{followUp ? (
						<span
							className="absolute left-0 mr-1 hidden h-5.5 w-[56px] cursor-default select-none text-right text-xs leading-loose text-[rgb(163_166_170)] group-hover:inline-block"
							id="time"
						>
							{new Date().toLocaleTimeString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
								hour12: true,
							})}
						</span>
					) : author ? (
						<DiscordMessageAuthor {...author} />
					) : (
						authorNode
					)}
					<div className="text-white [&>p]:m-0 [&>p]:leading-snug" id="message-content">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
