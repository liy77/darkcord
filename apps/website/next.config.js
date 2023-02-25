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
  cleanDistDir: true,
  outputFileTracing: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@microsoft/api-extractor-model", "jju", "shiki"],
    outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
    fallbackNodePolyfills: false,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
});
