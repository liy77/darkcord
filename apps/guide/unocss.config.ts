import { defineConfig, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
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
	],
});
