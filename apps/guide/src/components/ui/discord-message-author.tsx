import { Check } from 'lucide-react';
import Image from 'next/image';
import { cn } from '~/lib/util';

export interface DiscordMessageAuthorProps {
	readonly avatar: string;
	readonly bot?: boolean;
	readonly color?: string;
	readonly username: string;
	readonly verified?: boolean;
}

export function DiscordMessageAuthor({ avatar, username, bot, color, verified }: DiscordMessageAuthorProps) {
	return (
		<>
			<Image
				alt={`${username}'s profile avatar`}
				width={40}
				height={40}
				className="absolute left-[16px] h-10 w-10 mt-0.5 cursor-pointer select-none rounded-full"
				src={avatar}
			/>
			<h2 className="m-0 flex place-items-center text-inherit font-medium leading-snug">
				<span className="inline-flex place-items-center">
					<span className={cn('mr-1.5 cursor-pointer text-base font-medium hover:underline', color ?? 'text-white')}>
						{username}
					</span>
					{bot && (
						<span className="mr-1 inline-flex place-items-center rounded bg-[#5865F2] px-1 vertical-top text-[0.7rem]/4 font-normal text-white">
							{verified && <Check className="mr-0.5 inline-block stroke-3" />} BOT
						</span>
					)}
					<span className="ml-1 cursor-default text-xs leading-snug text-[rgb(163_166_170)]">
						{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
					</span>
				</span>
			</h2>
		</>
	);
}
