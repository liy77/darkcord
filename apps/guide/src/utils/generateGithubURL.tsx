export function generateGithubURL(pageURL: string) {
	return `https://github.com/JustAWaifuHunter/darkcord/tree/main/apps/guide/src/pages${pageURL || '/index'}.mdx`;
}
