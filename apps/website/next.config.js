import bundleAnalyzer from "@next/bundle-analyzer";
import { fileURLToPath } from "node:url";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
export default withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  cleanDistDir: false,
  outputFileTracing: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["jju", "shiki"],
    outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
    fallbackNodePolyfills: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
});
