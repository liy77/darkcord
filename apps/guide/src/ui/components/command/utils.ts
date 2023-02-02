export function openLink(url: string) {
	const link = document.createElement('a');

	link.href = url;

	link.click();
}
