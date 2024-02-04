import { env } from "~/env";
import { Documentation } from "~/types/documentation";

export async function getDocsJSON() {
	if (env.MODE !== "production") {
		const res = await fetch("/docs.api.json");
		const data = await res.json();

		return data as Documentation;
	}
}
