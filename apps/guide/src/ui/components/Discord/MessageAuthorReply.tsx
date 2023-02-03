export interface IDiscordMessageAuthorReply {
	avatar: string;
	bot?: boolean;
	username: string;
}

export function DiscordMessageAuthorReply({ avatar, bot, username }: IDiscordMessageAuthorReply) {
	return (
		<>
			<img alt={`${username}'s avatar`} className="mr-1 h-4 w-4 select-none rounded-full" src={avatar} />
			{bot ? <div className="vertical-top mr-1 rounded bg-[#5865F2] px-1 text-xs">BOT</div> : null}
			<span className="mr-1 cursor-pointer select-none text-sm font-medium leading-snug text-white hover:underline">
				{username}
			</span>
		</>
	);
}
