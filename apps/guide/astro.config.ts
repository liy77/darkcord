import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import prefetch from '@astrojs/prefetch';
import react from '@astrojs/react';
import unocss from '@unocss/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [
		react(),
		mdx(),
		prefetch({
			throttle: 3,
		}),
		unocss({ configFile: 'unocss.config.ts' }),
		image({ serviceEntryPoint: '@astrojs/image/sharp' }),
	],
});
