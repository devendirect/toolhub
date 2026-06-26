import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        // Defensive headers — toutes les pages
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // COEP/COOP requis pour SharedArrayBuffer (ffmpeg.wasm)
        // Uniquement sur les outils audio/vidéo — évite de bloquer GA sur le reste du site
        source: "/:lang/t/(audio-converter|video-converter)",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
