// Ping IndexNow (Bing/Seznam/Naver/Yandex — pas Google) avec les URLs nouvelles
// du sitemap. Exécuté par une tâche planifiée Plesk quotidienne :
// `node /…/httpdocs/scripts/indexnow-ping.mjs`
// (pas un hook de déploiement : les actions Plesk tournent avant le redémarrage
// Node.js — cf. docs/seo-geo/indexnow.md)
//
// Différentiel : ne soumet que les URLs absentes de l'envoi précédent
// (.indexnow-state.json à la racine du projet, local au serveur, gitignoré).
// Les jours sans changement, aucun ping ne part — les moteurs jaugent la
// fiabilité des soumissions. Premier envoi (pas d'état) : tout le sitemap.
//
// Source du sitemap : le fichier généré par `next build` sur le disque, en
// priorité. Le serveur ne sait pas toujours joindre son propre domaine (boucle
// réseau du VPS) : lire https://utilisio.com/sitemap.xml échouait en
// « fetch failed ». Le réseau ne sert plus qu'en secours.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilisio.com").replace(/\/$/, "");
const KEY = "8c9a97d416a14a7b51bb69713ddc5483f858305c7a0fb2587c738a6ff7405286";

// Chemins relatifs au script, pas au dossier courant (qui dépend de Plesk)
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const STATE_FILE = path.join(ROOT, ".indexnow-state.json");
const BUILT_SITEMAPS = [
  path.join(ROOT, ".next", "server", "app", "sitemap.xml.body"),
  path.join(ROOT, ".next", "standalone", ".next", "server", "app", "sitemap.xml.body"),
];

/** Message d'erreur utile : undici cache la vraie cause (ECONNREFUSED, ETIMEDOUT…) dans err.cause. */
function describe(err) {
  const cause = err?.cause;
  const detail = cause ? ` (${cause.code ?? cause.name ?? ""}${cause.message ? `: ${cause.message}` : ""})` : "";
  return `${err?.message ?? err}${detail}`;
}

async function loadSitemapXml() {
  for (const file of BUILT_SITEMAPS) {
    try {
      const xml = await readFile(file, "utf8");
      console.log(`indexnow: sitemap lu sur le disque (${path.relative(ROOT, file)})`);
      return xml;
    } catch {
      // fichier absent : essayer le suivant
    }
  }
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml → HTTP ${res.status}`);
  console.log("indexnow: sitemap lu en ligne");
  return res.text();
}

async function loadState() {
  try {
    return new Set(JSON.parse(await readFile(STATE_FILE, "utf8")));
  } catch {
    return new Set(); // premier envoi : tout le sitemap part (amorçage)
  }
}

async function main() {
  const xml = await loadSitemapXml();
  // Le fichier du build porte l'origine de NEXT_PUBLIC_SITE_URL au moment du build :
  // on la remplace par SITE_URL pour ne jamais soumettre localhost ou un autre domaine
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const u = new URL(m[1]);
    return `${SITE_URL}${u.pathname}${u.search}`;
  });
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
    // Trop de requêtes : abandonner, le différentiel repartira à la prochaine exécution
    console.warn("indexnow: 429 — abandon jusqu'à la prochaine exécution");
    return;
  }
  if (!ping.ok) throw new Error(`api.indexnow.org → HTTP ${ping.status} ${await ping.text().catch(() => "")}`.trim());

  await writeFile(STATE_FILE, JSON.stringify(urls, null, 2));
  console.log(`indexnow: ${diff.length} URL(s) soumises (HTTP ${ping.status})`);
}

main().catch((err) => {
  // Ne jamais faire échouer la tâche pour un ping raté — mais dire pourquoi
  console.error(`indexnow: ${describe(err)}`);
});
