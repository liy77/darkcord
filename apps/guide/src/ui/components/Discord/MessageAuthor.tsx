export interface IDiscordMessageAuthor {
	avatar: string;
	bot?: boolean;
	username: string;
}

export function DiscordMessageAuthor({ avatar, username, bot }: IDiscordMessageAuthor) {
	return (
		<>
			<img
				alt={`${username}'s avatar`}
				className="absolute left-[16px] mt-0.5 h-10 w-10 cursor-pointer select-none rounded-full"
				src={avatar}
			/>
			<h2 className="text-size-inherit m-0 font-medium leading-snug">
				<span className="mr-1">
					<span className="cursor-pointer text-base font-medium text-white hover:underline">{username}</span>
					{bot ? <span className="vertical-top relative top-1 ml-1 rounded bg-[#5865F2] px-1 text-xs">BOT</span> : null}
				</span>
				<span className="ml-1 cursor-default text-xs leading-snug text-[rgb(163_166_170)]">
					Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
				</span>
			</h2>
		</>
	);
}
