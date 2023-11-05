import { GuideConfig } from '~/types';

export const guideConfig: GuideConfig = {
	mainNav: [
		{
			title: 'Documentation',
			href: '/docs',
		},
	],
	sidebarNav: [
		{
			title: 'Getting Started',
			items: [
				{
					title: 'Introduction',
					href: '/guide',
					items: [],
				},
			],
		},
	],
};
