import bundleAnalyzer from '@next/bundle-analyzer';
import { withContentlayer } from 'next-contentlayer';

import './src/env.mjs';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(
	withContentlayer({
		reactStrictMode: true,
		experimental: {
			typedRoutes: true,
		},
		images: {
			dangerouslyAllowSVG: true,
			contentDispositionType: 'attachment',
			contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
			remotePatterns: [
				{
					protocol: 'https',
					hostname: 'cdn.discordapp.com',
				},
			],
		},
		poweredByHeader: false,
	}),
);
