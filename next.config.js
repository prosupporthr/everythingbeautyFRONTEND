/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
