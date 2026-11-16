import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/privacy-policy", destination: "/legal/privacy-policy" },
      { source: "/privacy", destination: "/legal/privacy-policy" },
      { source: "/terms-of-service", destination: "/legal/terms-of-service" },
      { source: "/terms", destination: "/legal/terms-of-service" },
      { source: "/cookie-policy", destination: "/legal/cookie-policy" },
      { source: "/cookies", destination: "/legal/cookie-policy" },
      { source: "/refund-policy", destination: "/legal/refund-policy" },
      { source: "/disclaimer", destination: "/legal/disclaimer" },
      { source: "/editorial-policy", destination: "/about" },
    ];
  },
  async headers() {
    return [
      {
        source: "/(public)/(video|audio)-tools/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/video-tools/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/audio-tools/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/workspace/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      }
    ]
  },
  serverExternalPackages: ["canvas"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      "onnxruntime-web/webgpu": "@/lib/empty-module",
    },
  },
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "onnxruntime-web/webgpu": false,
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-web/webgpu": false,
    }
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^onnxruntime-web\/webgpu$/,
      })
    )
    return config
  }
};

export default nextConfig;
