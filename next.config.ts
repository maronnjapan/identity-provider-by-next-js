import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: '/authorize',
      destination: '/api/authorize',
      permanent: false
    }]
  },
  /* config options here */
  async rewrites() {
    return [
      // {
      //   source: '/oauth/token',
      //   destination: 'http://localhost:8787/oauth/token',

      // }
      {
        source: '/oauth/token',
        destination: '/api/oauth/token',

      },
      {
        source: '/authorize',
        destination: '/api/authorize',

      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "*" },
          { key: 'Content-Security-Policy', value: "" },
        ]
      }
    ]
  }
};

export default nextConfig;
