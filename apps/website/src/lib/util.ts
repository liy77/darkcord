import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isAppleDevice() {
	return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
}

export function typeKey(
	type:
		| string[][]
		| {
				description: string;
				types: string[][][];
				variable: boolean;
				nullable: boolean;
		  },
) {
	if (Array.isArray(type)) {
		return typeof type === "string" ? type : type.join("-");
	}
}
