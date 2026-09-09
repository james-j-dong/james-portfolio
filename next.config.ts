import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The posts section was renamed from /log to /blog; keep old links alive.
    return [
      { source: "/log", destination: "/blog", permanent: true },
      { source: "/log/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
