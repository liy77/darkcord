export interface DiscordMessageAuthorReplyProps {
	avatar: string;
	bot?: boolean;
	username: string;
}

export function DiscordMessageAuthorReply({ avatar, bot, username }: DiscordMessageAuthorReplyProps) {
	return (
		<>
			<img
				alt={`${username ?? 'Liy'}'s avatar`}
				className="mr-1 h-4 w-4 select-none rounded-full"
				src={
					avatar ??
					'https://cdn.discordapp.com/avatars/630493603575103519/f6040d5d3a134837c487d5c67ddb7673.webp?size=160'
				}
			/>
			{bot ? <div className="bg-blue-6 vertical-top mr-1 rounded px-1 text-xs">BOT</div> : null}
			<span className="mr-1 cursor-pointer select-none text-sm font-medium leading-snug text-white hover:underline">
				{username ?? 'Liy'}
			</span>
		</>
	);
}
