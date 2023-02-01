import { defineConfig, presetTypography, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
	shortcuts: {
		'header-base': 'dark:bg-[#151718] dark:border-[#3a3f42] bg-white border-[#d7dbdf]',
		'border-base': 'dark:border-[#3a3f42] border-[#c1c8cd]',
	},
	presets: [
		presetUno({ dark: 'class' }),
		presetWebFonts({
			provider: 'bunny',
			fonts: {
				mono: ['JetBrains Mono:400,600,700'],
				'source-sans-pro': [
					'Source Sans Pro:300,400,500,600',
					{ name: 'ui-sans-serif', provider: 'none' },
					{ name: 'system-ui', provider: 'none' },
					{ name: '-apple-system', provider: 'none' },
					{ name: 'BlinkMacSystemFont', provider: 'none' },
					{ name: 'Segoe UI', provider: 'none' },
					{ name: 'Roboto', provider: 'none' },
					{ name: 'Helvetica Neue', provider: 'none' },
					{ name: 'Arial', provider: 'none' },
					{ name: 'sans-serif', provider: 'none' },
					{ name: 'Apple Color Emoji', provider: 'none' },
					{ name: 'Segoe UI Emoji', provider: 'none' },
					{ name: 'Segoe UI Symbol', provider: 'none' },
					{ name: 'Noto Color Emoji', provider: 'none' },
				],
			},
		}),
		presetTypography({
			cssExtend: {
				pre: {
					padding: '1em',
					'line-height': '1.5',
					'border-radius': '4px',
				},
				code: {
					'font-size': '1em',
					'font-weight': 'unset',
				},
				a: {
					'text-decoration': 'none',
				},
				'a > img': {
					display: 'inline-block',
				},
				h1: {
					'scroll-margin-top': '6.5rem',
				},
				'.level-h1': {
					margin: '1rem 0',
				},
				h2: {
					'margin-top': '1.25em',
					'scroll-margin-top': '6.5rem',
				},
				'.level-h2': {
					margin: '1.25em 0',
				},
				h3: {
					'margin-top': '1.25em',
					'scroll-margin-top': '6.5rem',
				},
				'.level-h3': {
					margin: '1.25em 0',
				},
				h4: {
					'margin-top': '1.25em',
					'scroll-margin-top': '6.5rem',
				},
				'.level-h4': {
					margin: '1.25em 0',
				},
				p: {
					margin: '.5em 0',
				},
			},
		}),
	],
	rules: [
		[
			/^text-(.*)$/,
			([, c], { theme }) => {
				if (theme.colors[c]) return { color: theme.colors[c] };
			},
		],
	],
	theme: {
		colors: {
			'theme-background-default': '#151718',
		},
	},
	include: [
		/.vue$/,
		/.vue?vue/,
		/.svelte$/,
		/.[jt]sx$/,
		/.mdx?$/,
		/.astro$/,
		/.elm$/,
		/.html$/,
		/.*\/ui\.js(.*)?$/,
		/.*\/ui\.mjs(.*)?$/,
	],
});
