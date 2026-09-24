import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { makeRateLimiter, makeCache, getRequesterIp, isSafeUrl } from "@/lib/route-security";
import { fetchPageHtml } from "@/lib/api-html-fetch";
import { extractMeta } from "@/lib/api-html-parse";

export interface SeoCheck {
  id:     string;
  label:  string;
  status: "pass" | "warn" | "fail";
  detail: string;
  points: number;
  max:    number;
}

export interface SeoData {
  url: string; score: number; title: string;
  description: string; wordCount: number; h1: string;
  checks: SeoCheck[];
}

type Lang = "fr" | "en";

const checkRate = makeRateLimiter(10, 60_000);
// Cache court : on relance l'analyse juste après avoir corrigé sa page, un
// résultat vieux de 30 min contredisait la correction.
const cache     = makeCache<SeoData>(60_000, 200);

const L = {
  en: {
    title: "Title tag", desc: "Meta description", h1: "H1 tag", headings: "Heading structure",
    words: "Content length", images: "Image alt texts", canonical: "Canonical tag", robots: "Robots meta",
    og: "Open Graph tags", twitter: "Twitter Card", links: "Links",
    missing: "Missing",
    chars: (n: number, ideal: string) => `${n} chars — ideal: ${ideal}`,
    manyH1: (n: number) => `${n} H1 found — use exactly 1`,
    wordsDetail: (n: number) => `${n} words — ideal: 300+`,
    noImages: "No images",
    withAlt: (ok: number, total: number) => `${ok}/${total} have alt`,
    canonicalMissing: "Missing — recommended to prevent duplicate content",
    robotsDefault: "Not set (defaults to index, follow)",
    ogFound: "og:title detected",
    ogMissing: "Missing — impacts social sharing",
    linksDetail: (i: number, e: number) => `${i} internal · ${e} external`,
  },
  fr: {
    title: "Balise title", desc: "Meta description", h1: "Balise H1", headings: "Structure des titres",
    words: "Longueur du contenu", images: "Texte alt des images", canonical: "Balise canonical", robots: "Meta robots",
    og: "Balises Open Graph", twitter: "Twitter Card", links: "Liens",
    missing: "Absente",
    chars: (n: number, ideal: string) => `${n} caractères — idéal : ${ideal}`,
    manyH1: (n: number) => `${n} H1 trouvés — n'en garder qu'un`,
    wordsDetail: (n: number) => `${n} mots — idéal : 300 et plus`,
    noImages: "Aucune image",
    withAlt: (ok: number, total: number) => `${ok}/${total} ont un attribut alt`,
    canonicalMissing: "Absente — recommandée contre le contenu dupliqué",
    robotsDefault: "Non définie (index, follow par défaut)",
    ogFound: "og:title détecté",
    ogMissing: "Absentes — pénalise les partages sur les réseaux",
    linksDetail: (i: number, e: number) => `${i} internes · ${e} externes`,
  },
} as const;

/** Analyse pure du HTML — exportée pour les tests. */
export function analyzeHtml(html: string, pageUrl: URL, lang: Lang): SeoData {
  const t = L[lang];
  const $ = cheerio.load(html);

  const title      = $("title").first().text().trim();
  const desc       = extractMeta($, "description");
  const h1s        = $("h1").map((_, el) => $(el).text().trim()).get();
  const h2s        = $("h2").length;
  const h3s        = $("h3").length;
  const images     = $("img");
  // alt="" est la bonne pratique pour une image décorative : seul l'attribut absent est une faute
  const imgsNoAlt  = images.filter((_, el) => $(el).attr("alt") === undefined).length;
  const canonical  = $('link[rel="canonical"]').attr("href") ?? "";
  const robots     = extractMeta($, "robots");
  const hasOg      = !!extractMeta($, "og:title");
  const hasTwitter = !!extractMeta($, "twitter:card");
  const origin     = pageUrl.origin;
  const internalLinks = $(`a[href^="/"], a[href^="${origin}"]`).length;
  const externalLinks = $("a[href^='http']").not(`[href^="${origin}"]`).length;

  // Le texte des <script> (payload des frameworks JS) gonflait le compte : plus du double sur un site Next.js
  $("script, style, noscript, template, svg").remove();
  const bodyText  = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(" ").filter(Boolean).length;

  const checks: SeoCheck[] = [
    {
      id: "title", label: t.title,
      status: !title ? "fail" : title.length < 30 || title.length > 65 ? "warn" : "pass",
      detail: title ? t.chars(title.length, "30-65") : t.missing,
      points: !title ? 0 : title.length < 30 || title.length > 65 ? 7 : 12, max: 12,
    },
    {
      id: "desc", label: t.desc,
      status: !desc ? "fail" : desc.length < 100 || desc.length > 165 ? "warn" : "pass",
      detail: desc ? t.chars(desc.length, "100-165") : t.missing,
      points: !desc ? 0 : desc.length < 100 || desc.length > 165 ? 6 : 12, max: 12,
    },
    {
      id: "h1", label: t.h1,
      status: h1s.length === 0 ? "fail" : h1s.length > 1 ? "warn" : "pass",
      detail: h1s.length === 0 ? t.missing : h1s.length > 1 ? t.manyH1(h1s.length) : `"${h1s[0]?.slice(0, 60)}"`,
      points: h1s.length === 1 ? 10 : h1s.length > 1 ? 5 : 0, max: 10,
    },
    {
      id: "headings", label: t.headings,
      status: h2s === 0 ? "warn" : "pass",
      detail: `H2: ${h2s} · H3: ${h3s}`,
      points: h2s > 0 ? 8 : 3, max: 8,
    },
    {
      id: "wordcount", label: t.words,
      status: wordCount < 150 ? "fail" : wordCount < 300 ? "warn" : "pass",
      detail: t.wordsDetail(wordCount),
      points: wordCount < 150 ? 0 : wordCount < 300 ? 4 : 10, max: 10,
    },
    {
      id: "images", label: t.images,
      status: imgsNoAlt === 0 ? "pass" : imgsNoAlt < 3 ? "warn" : "fail",
      detail: images.length === 0 ? t.noImages : t.withAlt(images.length - imgsNoAlt, images.length),
      points: imgsNoAlt === 0 ? 10 : imgsNoAlt < 3 ? 5 : 0, max: 10,
    },
    {
      id: "canonical", label: t.canonical,
      status: canonical ? "pass" : "warn",
      detail: canonical || t.canonicalMissing,
      points: canonical ? 8 : 2, max: 8,
    },
    {
      id: "robots", label: t.robots,
      status: robots.includes("noindex") ? "fail" : "pass",
      detail: robots || t.robotsDefault,
      points: robots.includes("noindex") ? 0 : 8, max: 8,
    },
    {
      id: "og", label: t.og,
      status: hasOg ? "pass" : "warn",
      detail: hasOg ? t.ogFound : t.ogMissing,
      points: hasOg ? 6 : 0, max: 6,
    },
    {
      id: "twitter", label: t.twitter,
      status: hasTwitter ? "pass" : "warn",
      detail: hasTwitter ? extractMeta($, "twitter:card") : t.missing,
      points: hasTwitter ? 4 : 0, max: 4,
    },
    {
      id: "links", label: t.links,
      status: "pass",
      detail: t.linksDetail(internalLinks, externalLinks),
      points: 8, max: 8,
    },
  ];

  const score = Math.round(
    (checks.reduce((s, c) => s + c.points, 0) /
     checks.reduce((s, c) => s + c.max,    0)) * 100
  );

  return { url: pageUrl.href, score, title, description: desc, wordCount, h1: h1s[0] ?? "", checks };
}

export async function GET(req: NextRequest) {
  const requesterIp = getRequesterIp(req);
  if (!checkRate(requesterIp)) {
    return NextResponse.json({ error: "Too many requests — please wait a minute." }, { status: 429 });
  }

  const raw = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!raw) return NextResponse.json({ error: "missing url" }, { status: 400 });

  const lang: Lang = req.nextUrl.searchParams.get("lang") === "fr" ? "fr" : "en";

  // Cache consulté avant le fetch : sinon il ne protégeait pas la cible
  const safe = isSafeUrl(raw);
  const cacheKey = safe.ok ? `${safe.url.href}:${lang}` : "";
  const cached = cacheKey ? cache.get(cacheKey) : undefined;
  if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });

  const fetched = await fetchPageHtml(raw);
  if (!fetched.ok) return fetched.response;

  const data = analyzeHtml(fetched.html, fetched.url, lang);
  cache.set(`${fetched.url.href}:${lang}`, data);
  return NextResponse.json(data);
}
