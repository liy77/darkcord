import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isAppleDevice() {
	return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
}
