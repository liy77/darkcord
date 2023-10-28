import { Check } from 'lucide-react';
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
			<img
				alt={`${username}'s avatar`}
				className="absolute left-[16px] mt-0.5 h-10 w-10 cursor-pointer select-none rounded-full"
				src={avatar}
			/>
			<h2 className="m-0 flex place-items-center text-size-inherit font-medium leading-snug" id="user-info">
				<span className="inline-flex place-items-center" id="username">
					<span className={cn('mr-1.5 cursor-pointer text-base font-medium hover:underline', color ?? 'text-white')}>
						{username}
					</span>
					{bot ? (
						<span
							className="mr-1 inline-flex place-items-center rounded bg-[#5865F2] px-1 vertical-top text-[0.7rem]/4 font-normal text-white"
							id="bot"
						>
							{verified ? <Check className="mr-0.5 inline-block stroke-3" /> : null} BOT
						</span>
					) : null}
				</span>
				<span className="ml-1 cursor-default text-xs leading-snug text-[rgb(163_166_170)]" id="time">
					{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
				</span>
			</h2>
		</>
	);
}
