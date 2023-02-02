export interface DiscordMessageAuthorProps {
	avatar: string;
	bot?: boolean;
	username: string;
}

export function DiscordMessageAuthor({ avatar, username, bot }: DiscordMessageAuthorProps) {
	return (
		<>
			<img
				alt={`${username ?? 'Liy'}'s avatar`}
				className="absolute left-[16px] mt-0.5 h-10 w-10 cursor-pointer select-none rounded-full"
				src={
					avatar ??
					'https://cdn.discordapp.com/avatars/630493603575103519/f6040d5d3a134837c487d5c67ddb7673.webp?size=160'
				}
			/>
			<h2 className="text-size-inherit m-0 font-medium leading-snug">
				<span className="mr-1">
					<span className="cursor-pointer text-base font-medium text-white hover:underline">{username ?? 'Liy'}</span>

					{bot ? <span className="bg-blue-6 vertical-top relative top-1 ml-1 rounded px-1 text-xs">BOT</span> : null}
				</span>

				<span className="ml-1 cursor-default text-xs leading-snug text-[rgb(163_166_170)]">
					Today at{' '}
					{new Date().toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						hour12: false,
					})}
				</span>
			</h2>
		</>
	);
}
