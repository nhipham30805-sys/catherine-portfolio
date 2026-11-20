import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old page names from the first build.
  async redirects() {
    return [
      { source: "/projects", destination: "/education", permanent: true },
      { source: "/awards", destination: "/leadership", permanent: true },
    ];
  },
};

export default nextConfig;
