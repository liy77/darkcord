import type { PropsWithChildren, ReactNode } from 'react';
import { DiscordMessageAuthorReply, DiscordMessageAuthorReplyProps } from "..";

interface DiscordMessageBaseProps {
	author?: DiscordMessageAuthorReplyProps | undefined;
	node?: ReactNode | undefined;
}

export function DiscordMessageBase({ author, children, node }: PropsWithChildren<DiscordMessageBaseProps>) {
	return (
		<div className="before:rounded-tl-1.5 relative mb-1 flex place-items-center before:absolute before:left-[-36px] before:right-full before:top-[50%] before:bottom-0 before:mr-1 before:block before:border-l-2 before:border-t-2 before:border-[rgb(79_84_92)] before:content-none">
			<div className="flex place-items-center [&>span]:opacity-60">
				{author ? <DiscordMessageAuthorReply {...author} /> : node}
			</div>
			{children}
		</div>
	);
}
