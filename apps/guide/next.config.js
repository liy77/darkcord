const bundleAnalyzer = require('@next/bundle-analyzer');
const { withContentlayer } = require('next-contentlayer');

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
	withContentlayer({
		reactStrictMode: true,
		experimental: {
			typedRoutes: true,
		},
		images: {
			dangerouslyAllowSVG: true,
			contentDispositionType: 'attachment',
			contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
		},
		poweredByHeader: false,
	}),
);
