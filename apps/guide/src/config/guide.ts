import { MainNavItem, SidebarNavItem } from '~/types/index';
import { siteConfig } from './site';

interface GuideConfig {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
}

export const guideConfig: GuideConfig = {
	mainNav: [
		{
			title: 'Documentation',
			disabled: true,
		},
		{
			title: 'GitHub',
			href: siteConfig.links.github,
			external: true,
		},
	],
	sidebarNav: [
		{
			title: 'Getting Started',
			items: [
				{
					title: 'Introduction',
					href: '/guide/getting-started',
					items: [],
				},
				{
					title: 'Installation',
					href: '/guide/getting-started/installation',
					items: [],
				},
			],
		},
	],
};
