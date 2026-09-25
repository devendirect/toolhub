// Copie le worker PDF.js de node_modules vers public/, avant chaque build et
// chaque `npm run dev` (hooks prebuild / predev de package.json).
//
// Il était chargé depuis unpkg.com à chaque conversion : une requête vers un
// tiers qui voit l'IP du visiteur (contraire à la politique de confidentialité)
// et une panne de l'outil dès qu'unpkg est indisponible. Copié depuis le paquet
// installé, le worker a toujours exactement la version de pdfjs-dist.
// Le fichier généré est gitignoré.

import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath plutôt que import.meta.dirname (Node ≥ 20.11 seulement)
const root = fileURLToPath(new URL("..", import.meta.url));
const from = path.join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const to = path.join(root, "public", "pdf.worker.min.mjs");

await copyFile(from, to);
console.log("pdf.worker.min.mjs → public/");
