import { Check } from 'lucide-react';
import Image from 'next/image';
import { cn } from '~/lib/util';

export interface DiscordMessageAuthorReplyProps {
	readonly avatar: string;
	readonly bot?: boolean;
	readonly color?: string;
	readonly username: string;
	readonly verified?: boolean;
}

export function DiscordMessageAuthorReply({ avatar, username, bot, color, verified }: DiscordMessageAuthorReplyProps) {
	return (
		<>
			<Image src={avatar} width={16} height={16} className="mr-1.5 h-4 w-4 select-none rounded-full" alt={`${username}'s profile avatar`} />
			{bot && (
				<div className="mr-1 inline-flex place-items-center rounded bg-[#5865F2] px-1 vertical-top text-[0.7rem]/4 font-normal text-white">
					{verified && <Check className="mr-0.5 inline-block stroke-3" />} BOT
				</div>
			)}
			<span className={cn('mr-1 cursor-pointer select-none text-sm font-medium leading-snug', color ?? 'text-white')}>
				{username}
			</span>
		</>
	);
}
