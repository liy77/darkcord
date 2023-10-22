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

export function DiscordMessage(props: PropsWithChildren<DiscordMessageProps>) {
	return (
		<div className="relative">
			<div className={cn('pl-18 hover:bg-[rgb(4_4_5)]/7 py-0.5 pr-12 leading-snug', props.followUp ? '' : 'mt-4')}>
				{(props.reply || props.replyNode) && !props.followUp ? (
					props.reply ? (
						<DiscordMessageReply {...props.reply} />
					) : (
						props.replyNode ?? null
					)
				) : null}
				{(props.interaction || props.interactionNode) && !(props.reply || props.replyNode) && !props.followUp ? (
					props.interaction ? (
						<DiscordMessageInteraction {...props.interaction} />
					) : (
						props.interactionNode ?? null
					)
				) : null}
				<div className="static">
					{props.followUp ? (
						<span className="absolute left-0 mr-1 hidden h-5.5 w-[56px] cursor-default select-none text-right text-xs leading-loose text-[rgb(163_166_170)] group-hover:inline-block">
							{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
						</span>
					) : props.author ? (
						<DiscordMessageAuthor {...props.author} />
					) : (
						props.authorNode
					)}
					<div className="text-white [&>p]:m-0 [&>p]:leading-snug">{props.children}</div>
				</div>
			</div>
		</div>
	);
}
