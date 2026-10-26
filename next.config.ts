import type { NextConfig } from "next"
import path from "path";

const API = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API}/api/:path*` }];
  },
  turbopack: {
  root: path.resolve(__dirname),
  rules: {
    "*.css": {
      loaders: ["@tailwindcss/turbopack"],
      as: "*.css",
    },
  },
},
};

export default nextConfig;
