export async function getPackageREADME(_packageName: string): Promise<string> {
	const response = await fetch("/README.md");

	return response.text();
}
