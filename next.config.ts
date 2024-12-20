import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/oauth/token',
        destination: '/api/oauth/token'
      }
    ]
  },
};

export default nextConfig;
