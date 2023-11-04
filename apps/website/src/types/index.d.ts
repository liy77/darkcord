export interface NavItem {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
}

export interface NavItemWithChildren extends NavItem {
	items: NavItemWithChildren[];
}

export type MainNavItem = NavItem;

export type SidebarNavItem = NavItemWithChildren;

export interface SiteConfig {
	description: string;
	links: {
		github: string;
	};
	name: string;
	url: string;
}

export type GuideConfig = {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
};

export type DocsConfig = {
	mainNav: MainNavItem[];
};

export interface RootConfig {
	mainNav: MainNavItem[];
}
