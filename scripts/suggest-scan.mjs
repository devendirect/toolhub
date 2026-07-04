// Cartographie de la demande réelle via l'autocomplétion Google (endpoint public).
// Meilleur proxy gratuit de ce que les gens tapent vraiment — base du plan pSEO
// (docs/seo-geo/seo-programmatique.md).
//
// Usage : node scripts/suggest-scan.mjs [sortie.csv]
// Sortie CSV : lang,query,rank,suggestion — le rang dans les suggestions est un
// proxy grossier du volume relatif.

import { writeFile } from "node:fs/promises";

// Racines par famille d'outils — étendre ici au fil des besoins
const QUERIES = {
  en: [
    // paires de conversion (image, pdf, audio, vidéo)
    "convert jpg to", "convert png to", "convert webp to", "convert avif to",
    "convert pdf to", "convert wav to", "convert mp3 to", "convert flac to",
    "convert mp4 to", "jpg to webp", "png to webp", "pdf to docx",
    // dev
    "json formatter", "json validator", "uuid v", "uuid generator",
    "base64 ", "base64 decode", "md5 ", "sha256 ", "hash generator",
    "regex tester", "cron every", "cron expression", "jwt ",
    "markdown table", "toml to",
    // texte / seo / design
    "word counter", "case converter", "camelcase ", "remove line breaks",
    "readability score", "url encoder", "html entity",
    "qr code generator", "password generator", "color palette generator",
    "css gradient", "utm builder", "meta tag preview", "seo analyzer",
    "ip lookup", "http headers check",
  ],
  fr: [
    "convertir jpg en", "convertir png en", "convertir pdf en",
    "convertir wav en", "convertir mp4 en", "jpg en webp",
    "formater json", "générateur uuid", "base64 décoder",
    "générateur hash", "testeur regex", "expression cron",
    "compteur de mots", "convertisseur majuscule",
    "générateur qr code", "générateur mot de passe",
    "générateur palette couleur", "dégradé css", "générateur utm",
    "analyse seo en ligne", "supprimer sauts de ligne",
  ],
};

const DELAY_MS = 300; // rester poli avec l'endpoint public

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const csvField = (s) => (/[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s);

async function suggest(q, hl) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.[1]) ? data[1] : [];
}

async function main() {
  const out = process.argv[2] ?? "suggest-scan.csv";
  const rows = ["lang,query,rank,suggestion"];
  let done = 0;
  const total = QUERIES.en.length + QUERIES.fr.length;

  for (const [lang, queries] of Object.entries(QUERIES)) {
    for (const q of queries) {
      const suggestions = await suggest(q, lang);
      suggestions.forEach((s, i) => {
        rows.push([lang, csvField(q), i + 1, csvField(s)].join(","));
      });
      done += 1;
      process.stdout.write(`\r${done}/${total} requêtes…`);
      await sleep(DELAY_MS);
    }
  }

  await writeFile(out, rows.join("\n") + "\n", "utf8");
  console.log(`\n${rows.length - 1} suggestions → ${out}`);
}

main().catch((err) => {
  console.error(`suggest-scan: ${err.message}`);
  process.exit(1);
});
