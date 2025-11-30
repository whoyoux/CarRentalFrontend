import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  transpilePackages: [],
  compiler: {
    styledComponents: false,
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
  },
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com"
      }
    ]
  },
};

export default nextConfig;
