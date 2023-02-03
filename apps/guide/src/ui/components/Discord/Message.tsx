import type { PropsWithChildren, ReactNode } from 'react';
import type { IDiscordMessageAuthor } from './MessageAuthor.jsx';
import { DiscordMessageAuthor } from './MessageAuthor.jsx';
import type { IDiscordMessageInteraction } from './MessageInteraction';
import { DiscordMessageInteraction } from './MessageInteraction.jsx';
import type { IDiscordMessageReply } from './MessageReply';
import { DiscordMessageReply } from './MessageReply.jsx';

interface IMessage {
	author?: IDiscordMessageAuthor | undefined;
	authorNode?: ReactNode | undefined;
	followUp?: boolean;
	interaction?: IDiscordMessageInteraction | undefined;
	interactionNode?: ReactNode | undefined;
	reply?: IDiscordMessageReply | undefined;
	replyNode?: ReactNode | undefined;
}

function MessageReply({ reply, replyNode, followUp }: Partial<IMessage>) {
	return (
		<>{(reply || replyNode) && !followUp ? reply ? <DiscordMessageReply {...reply} /> : replyNode ?? null : null}</>
	);
}

function MessageInteraction({ interaction, interactionNode, reply, replyNode, followUp }: Partial<IMessage>) {
	return (
		<>
			{(interaction || interactionNode) && !(reply || replyNode) && !followUp ? (
				interaction ? (
					<DiscordMessageInteraction {...interaction} />
				) : (
					interactionNode ?? null
				)
			) : null}
		</>
	);
}

export function FollowUp({ followUp, author, authorNode }: Partial<IMessage>) {
	return (
		<>
			{followUp ? (
				<span className="h-5.5 absolute left-0 mr-1 hidden w-[56px] cursor-default select-none text-right text-xs leading-loose text-[rgb(163_166_170)] group-hover:inline-block">
					Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
				</span>
			) : author ? (
				<DiscordMessageAuthor {...author} />
			) : (
				authorNode
			)}
		</>
	);
}

export function DiscordMessage({
	interaction,
	interactionNode,
	reply,
	replyNode,
	followUp,
	children,
	author,
	authorNode,
}: PropsWithChildren<IMessage>) {
	return (
		<div className="relative">
			<div className={`pl-18 hover:bg-[rgb(4_4_5)]/7 group py-0.5 pr-12 leading-snug ${followUp ? '' : 'mt-4'}`}>
				<MessageReply followUp={followUp} reply={reply} replyNode={replyNode} />

				<MessageInteraction
					followUp={followUp}
					interaction={interaction}
					interactionNode={interactionNode}
					reply={reply}
					replyNode={replyNode}
				/>
				<div className="static">
					<FollowUp author={author} authorNode={authorNode} followUp={followUp} />
					<div className="text-white [&>p]:m-0 [&>p]:leading-snug">{children}</div>
				</div>
			</div>
		</div>
	);
}
