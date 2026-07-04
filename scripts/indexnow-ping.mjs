// Ping IndexNow (Bing/Seznam/Naver/Yandex — pas Google) avec les URLs nouvelles
// ou modifiées du sitemap. Exécuté par une tâche planifiée Plesk quotidienne,
// depuis /httpdocs : `node scripts/indexnow-ping.mjs`
// (pas un hook de déploiement : les actions Plesk tournent avant le redémarrage
// Node.js et liraient l'ancien sitemap — cf. docs/seo-geo/indexnow.md)
//
// Différentiel : ne soumet que les URLs absentes de l'envoi précédent
// (.indexnow-state.json, local au serveur, gitignoré). Les jours sans changement,
// aucun ping ne part — les moteurs jaugent la fiabilité des soumissions.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilisio.com").replace(/\/$/, "");
const KEY = "8c9a97d416a14a7b51bb69713ddc5483f858305c7a0fb2587c738a6ff7405286";
const STATE_FILE = path.join(process.cwd(), ".indexnow-state.json");

async function loadState() {
  try {
    return new Set(JSON.parse(await readFile(STATE_FILE, "utf8")));
  } catch {
    return new Set(); // premier envoi : tout le sitemap part (amorçage)
  }
}

async function main() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml → HTTP ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap vide — abandon");

  const sent = await loadState();
  const diff = urls.filter((u) => !sent.has(u));

  if (diff.length === 0) {
    console.log(`indexnow: rien de nouveau (${urls.length} URLs déjà soumises)`);
    return;
  }

  const ping = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList: diff, // max 10 000 URLs par POST — largement suffisant ici
    }),
  });

  if (ping.status === 429) {
    // Trop de requêtes : abandonner, le différentiel repartira au prochain déploiement
    console.warn("indexnow: 429 — abandon jusqu'au prochain déploiement");
    return;
  }
  if (!ping.ok) throw new Error(`api.indexnow.org → HTTP ${ping.status}`);

  await writeFile(STATE_FILE, JSON.stringify(urls, null, 2));
  console.log(`indexnow: ${diff.length} URL(s) soumises (HTTP ${ping.status})`);
}

main().catch((err) => {
  // Ne jamais faire échouer un déploiement pour un ping raté
  console.error(`indexnow: ${err.message}`);
});
