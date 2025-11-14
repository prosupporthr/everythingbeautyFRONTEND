import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pagis-bucket.s3.eu-north-1.amazonaws.com",
        pathname: "/**", // allow all paths
      },
    ],
    unoptimized: true,
  }
};

export default nextConfig;
