import { RootConfig } from '~/types';
import { siteConfig } from './site';

export const rootConfig: RootConfig = {
	mainNav: [
		{
			title: 'Documentation',
			href: '/docs',
		},
		{
			title: 'Guide',
			href: '/guide',
		},
		{
			title: 'GitHub',
			href: siteConfig.links.github,
			external: true,
		},
	],
};
