const bundleAnalyzer = require('@next/bundle-analyzer');
const { withContentlayer } = require('next-contentlayer');

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
	withContentlayer({
		reactStrictMode: true,
		images: {
			dangerouslyAllowSVG: true,
			contentDispositionType: 'attachment',
			remotePatterns: [
				{
					protocol: 'https',
					hostname: 'media.discordapp.net',
				},
				{
					protocol: 'https',
					hostname: 'cdn.discordapp.com',
				}
			],
			contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
		},
		poweredByHeader: false,
	}),
);
