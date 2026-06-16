import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Required for ffmpeg.wasm (SharedArrayBuffer)
          { key: "Cross-Origin-Embedder-Policy",  value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy",    value: "same-origin" },
          // Defensive headers
          { key: "X-Frame-Options",               value: "DENY" },
          { key: "X-Content-Type-Options",        value: "nosniff" },
          { key: "Referrer-Policy",               value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
