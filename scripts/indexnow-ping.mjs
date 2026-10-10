import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Ping IndexNow (Bing/Seznam/Naver/Yandex — pas Google) avec les URLs ajoutées,
// modifiées ou retirées du sitemap. Exécuté par une tâche planifiée Plesk quotidienne :
// `node /…/httpdocs/scripts/indexnow-ping.mjs`
// (pas un hook de déploiement : les actions Plesk tournent avant le redémarrage
// Node.js — cf. docs/seo-geo/indexnow.md)
//
// Différentiel, contre l'envoi précédent (.indexnow-state.json à la racine du
// projet, local au serveur, gitignoré, format { url: lastmod }) :
//   - URL absente de l'état                → ajoutée
//   - <lastmod> différent de celui retenu  → modifiée (dates issues de lib/changelog.ts
//                                             et de `updated` des guides, jamais inventées)
//   - URL de l'état absente du sitemap     → retirée (les moteurs constatent le 404/308)
// Les jours sans changement, aucun ping ne part — les moteurs jaugent la
// fiabilité des soumissions. Premier envoi (pas d'état) : tout le sitemap.
//
// Options :
//   --dry-run          affiche ce qui partirait, n'envoie rien, ne touche pas à l'état
//   --urls a,b,…       envoi manuel de ces URLs ou chemins (/fr/guides/x), état inchangé
//
// Source du sitemap : le fichier généré par `next build` sur le disque, en
// priorité. Le serveur ne sait pas toujours joindre son propre domaine (boucle
// réseau du VPS) : lire https://utilisio.com/sitemap.xml échouait en
// « fetch failed ». Le réseau ne sert plus qu'en secours.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilisio.com").replace(/\/$/, "");
const KEY = "8c9a97d416a14a7b51bb69713ddc5483f858305c7a0fb2587c738a6ff7405286";

// Garde-fou : un sitemap qui perd plus de cette part des URLs connues est
// probablement cassé (build partiel) — on n'annonce pas des centaines de retraits.
const MAX_REMOVED_RATIO = 0.2;

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

/**
 * Entrées du sitemap : { url, lastmod } (lastmod = "" si absent). L'origine du
 * fichier de build est celle de NEXT_PUBLIC_SITE_URL au moment du build : on la
 * remplace par siteUrl pour ne jamais soumettre localhost ou un autre domaine.
 */
export function parseSitemap(xml, siteUrl = SITE_URL) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap((m) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1]);
    if (!loc) return [];
    const u = new URL(loc[1].trim());
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1].trim() ?? "";
    return [{ url: `${siteUrl}${u.pathname}${u.search}`, lastmod }];
  });
}

/**
 * État précédent sous forme de Map url → lastmod. Accepte l'ancien format (tableau
 * d'URLs, sans date) : ces URLs sont connues, avec une date inconnue (null).
 */
export function parseState(json) {
  const data = JSON.parse(json);
  if (Array.isArray(data)) return new Map(data.map((u) => [u, null]));
  return new Map(Object.entries(data));
}

/**
 * Différentiel entre le sitemap et l'état. Une URL connue sans date (ancien
 * format) n'est renvoyée que si le sitemap lui donne maintenant une date.
 */
export function computeDiff(entries, state) {
  const added = [];
  const updated = [];
  for (const { url, lastmod } of entries) {
    if (!state.has(url)) added.push(url);
    else if (lastmod && state.get(url) !== lastmod) updated.push(url);
  }
  const current = new Set(entries.map((e) => e.url));
  const removed = [...state.keys()].filter((u) => !current.has(u));
  return { added, updated, removed };
}

export function stateFrom(entries) {
  return Object.fromEntries(entries.map((e) => [e.url, e.lastmod]));
}

/** URLs passées à --urls : chemins ou URLs complètes, toujours ramenées au domaine du site. */
export function manualUrls(arg, siteUrl = SITE_URL) {
  return arg.split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
    if (s.startsWith("/")) return `${siteUrl}${s}`;
    const u = new URL(s);
    if (`${u.protocol}//${u.host}` !== siteUrl) throw new Error(`URL hors du site : ${s}`);
    return `${siteUrl}${u.pathname}${u.search}`;
  });
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
    return parseState(await readFile(STATE_FILE, "utf8"));
  } catch {
    return new Map(); // premier envoi : tout le sitemap part (amorçage)
  }
}

/** POST IndexNow. Renvoie false sur 429 (abandon jusqu'à la prochaine exécution). */
async function submit(urlList) {
  const ping = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList, // max 10 000 URLs par POST — largement suffisant ici
    }),
  });
  if (ping.status === 429) {
    console.warn("indexnow: 429 — abandon jusqu'à la prochaine exécution");
    return false;
  }
  if (!ping.ok) throw new Error(`api.indexnow.org → HTTP ${ping.status} ${await ping.text().catch(() => "")}`.trim());
  console.log(`indexnow: ${urlList.length} URL(s) soumises (HTTP ${ping.status})`);
  return true;
}

async function main(argv) {
  const dryRun = argv.includes("--dry-run");
  const urlsArg = argv.find((a, i) => argv[i - 1] === "--urls") ?? argv.find((a) => a.startsWith("--urls="))?.slice(7);

  if (urlsArg !== undefined) {
    const list = manualUrls(urlsArg);
    if (list.length === 0) throw new Error("--urls : aucune URL");
    if (dryRun) { console.log(`indexnow (dry-run, manuel) :\n  ${list.join("\n  ")}`); return; }
    await submit(list); // envoi ponctuel : l'état du différentiel n'est pas modifié
    return;
  }

  const entries = parseSitemap(await loadSitemapXml());
  if (entries.length === 0) throw new Error("sitemap vide — abandon");

  const state = await loadState();
  const { added, updated, removed } = computeDiff(entries, state);
  if (state.size > 0 && removed.length / state.size > MAX_REMOVED_RATIO) {
    throw new Error(`${removed.length} URLs sur ${state.size} disparues du sitemap — sitemap suspect, abandon`);
  }
  const urlList = [...added, ...updated, ...removed];
  console.log(`indexnow: ${added.length} ajoutée(s), ${updated.length} modifiée(s), ${removed.length} retirée(s)`);
  if (urlList.length === 0) {
    console.log(`indexnow: rien de nouveau (${entries.length} URLs déjà soumises)`);
    return;
  }
  if (dryRun) { console.log(`indexnow (dry-run) :\n  ${urlList.join("\n  ")}`); return; }

  if (await submit(urlList)) await writeFile(STATE_FILE, JSON.stringify(stateFrom(entries), null, 2));
}

// Exécuté directement (tâche Plesk) — pas quand les tests importent les fonctions.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    // Ne jamais faire échouer la tâche pour un ping raté — mais dire pourquoi
    console.error(`indexnow: ${describe(err)}`);
  });
}
