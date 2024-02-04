import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn, isAppleDevice } from "~/lib/util";
import {
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandList,
} from "./ui/command";

export function DocsSearcher() {
	const [opened, setOpened] = useState(false);

	useEffect(() => {
		function down(e: KeyboardEvent) {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}

				e.preventDefault();
				setOpened((opened) => !opened);
			}
		}

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<Button
				variant="outline"
				className={cn(
					"relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
				)}
				onClick={() => setOpened(true)}
			>
				<span className="hidden lg:inline-flex">Search documentation...</span>
				<span className="inline-flex lg:hidden">Search...</span>
				<kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">{isAppleDevice() ? "⌘" : "Ctrl"}</span>K
				</kbd>
			</Button>
			<CommandDialog open={opened} onOpenChange={setOpened}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</CommandDialog>
		</>
	);
}
