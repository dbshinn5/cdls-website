import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ioes.ucla.edu',
      },
      {
        protocol: 'https',
        hostname: 'ioes.ucla.edu.test',
      },
      {
        protocol: 'https',
        hostname: '*.ioes.ucla.edu',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'http',
        hostname: 'ioes.ucla.edu.test',
      },
    ],
  },
};

export default nextConfig;
