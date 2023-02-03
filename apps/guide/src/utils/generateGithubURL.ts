export function generateGithubURL(pageURL: string) {
	return `https://github.com/JustAWaifuHunter/darkcord/edit/master/apps/guide/src/pages${pageURL || '/index'}.mdx`;
}
