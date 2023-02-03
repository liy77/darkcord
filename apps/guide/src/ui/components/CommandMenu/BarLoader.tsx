export function BarLoader({ isLoading }: { isLoading: boolean }) {
	return (
		<div
			className="absolute left-[1px] mt-[11px] h-[2px] bg-[#52a9ff]"
			style={{
				transition: isLoading ? '2000ms ease-in-out 0s infinite normal none running animate-search' : undefined,
			}}
		/>
	);
}
