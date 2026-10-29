import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Le layout racine est app/[lang]/layout.tsx : sans layout au-dessus, les URL
  // sans route ont besoin de app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  async redirects() {
    return [
      // text-diff fusionné dans diff-viewer : même workspace, contenu en double
      { source: "/:lang(en|fr)/t/text-diff", destination: "/:lang/t/diff-viewer", permanent: true },
      // og-checker fusionné dans meta-preview : même API, même données
      { source: "/:lang(en|fr)/t/og-checker", destination: "/:lang/t/meta-preview", permanent: true },
    ];
  },
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
