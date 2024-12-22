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
  async headers() {
    return [
      {
        source: "/api/oauth/token",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ]
      }
    ]
  }
};

export default nextConfig;
