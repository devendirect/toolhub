import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import {
  isSafeUrl,
  makeRateLimiter,
  makeCache,
  checkResponseSize,
  checkTextSize,
  getRequesterIp,
} from "@/lib/route-security";

export interface SeoCheck {
  id:     string;
  label:  string;
  status: "pass" | "warn" | "fail";
  detail: string;
  points: number;
  max:    number;
}

const checkRate = makeRateLimiter(10, 60_000);
const cache     = makeCache<object>(30 * 60 * 1000, 200); // 30 min, 200 URLs

export async function GET(req: NextRequest) {
  // Rate limiting
  const requesterIp = getRequesterIp(req);
  if (!checkRate(requesterIp)) {
    return NextResponse.json({ error: "Too many requests — please wait a minute." }, { status: 429 });
  }

  // Validation URL + SSRF
  const raw = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!raw) return NextResponse.json({ error: "missing url" }, { status: 400 });

  const safe = isSafeUrl(raw);
  if (!safe.ok) return NextResponse.json({ error: safe.error }, { status: 400 });

  const cacheKey = safe.url.href;

  // Cache
  const cached = cache.get(cacheKey);
  if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });

  // Fetch
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(raw, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; toolhub-bot/1.0)" },
    });
    clearTimeout(timer);

    // Limite de taille
    const sizeError = checkResponseSize(res);
    if (sizeError) return NextResponse.json({ error: sizeError }, { status: 413 });

    // Vérifie que c'est bien du HTML
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) {
      return NextResponse.json({ error: "response is not HTML" }, { status: 422 });
    }

    const html = await res.text();
    const textSizeError = checkTextSize(html);
    if (textSizeError) return NextResponse.json({ error: textSizeError }, { status: 413 });
    const $ = cheerio.load(html);

    const m = (name: string) =>
      $(`meta[name="${name}"]`).attr("content") ??
      $(`meta[property="${name}"]`).attr("content") ?? "";

    const title      = $("title").first().text().trim();
    const desc       = m("description");
    const h1s        = $("h1").map((_, el) => $(el).text().trim()).get();
    const h2s        = $("h2").length;
    const h3s        = $("h3").length;
    const bodyText   = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount  = bodyText.split(" ").filter(Boolean).length;
    const images     = $("img");
    const imgsNoAlt  = images.filter((_, el) => !$(el).attr("alt")).length;
    const canonical  = $('link[rel="canonical"]').attr("href") ?? "";
    const robots     = m("robots");
    const hasOg      = !!m("og:title");
    const hasTwitter = !!m("twitter:card");
    const internalLinks = $(`a[href^="/"], a[href^="${safe.url.origin}"]`).length;
    const externalLinks = $("a[href^='http']").not(`[href^="${safe.url.origin}"]`).length;

    const checks: SeoCheck[] = [
      {
        id: "title", label: "Title tag",
        status: !title ? "fail" : title.length < 30 || title.length > 65 ? "warn" : "pass",
        detail: title ? `${title.length} chars — ideal: 30-65` : "Missing",
        points: !title ? 0 : title.length < 30 || title.length > 65 ? 7 : 12, max: 12,
      },
      {
        id: "desc", label: "Meta description",
        status: !desc ? "fail" : desc.length < 100 || desc.length > 165 ? "warn" : "pass",
        detail: desc ? `${desc.length} chars — ideal: 100-165` : "Missing",
        points: !desc ? 0 : desc.length < 100 || desc.length > 165 ? 6 : 12, max: 12,
      },
      {
        id: "h1", label: "H1 tag",
        status: h1s.length === 0 ? "fail" : h1s.length > 1 ? "warn" : "pass",
        detail: h1s.length === 0 ? "Missing" : h1s.length > 1 ? `${h1s.length} H1 found — use exactly 1` : `"${h1s[0]?.slice(0, 60)}"`,
        points: h1s.length === 1 ? 10 : h1s.length > 1 ? 5 : 0, max: 10,
      },
      {
        id: "headings", label: "Heading structure",
        status: h2s === 0 ? "warn" : "pass",
        detail: `H2: ${h2s} · H3: ${h3s}`,
        points: h2s > 0 ? 8 : 3, max: 8,
      },
      {
        id: "wordcount", label: "Content length",
        status: wordCount < 150 ? "fail" : wordCount < 300 ? "warn" : "pass",
        detail: `${wordCount} words — ideal: 300+`,
        points: wordCount < 150 ? 0 : wordCount < 300 ? 4 : 10, max: 10,
      },
      {
        id: "images", label: "Image alt texts",
        status: imgsNoAlt === 0 ? "pass" : imgsNoAlt < 3 ? "warn" : "fail",
        detail: images.length === 0 ? "No images" : `${images.length - imgsNoAlt}/${images.length} have alt`,
        points: imgsNoAlt === 0 ? 10 : imgsNoAlt < 3 ? 5 : 0, max: 10,
      },
      {
        id: "canonical", label: "Canonical tag",
        status: canonical ? "pass" : "warn",
        detail: canonical || "Missing — recommended to prevent duplicate content",
        points: canonical ? 8 : 2, max: 8,
      },
      {
        id: "robots", label: "Robots meta",
        status: robots.includes("noindex") ? "fail" : "pass",
        detail: robots || "Not set (defaults to index, follow)",
        points: robots.includes("noindex") ? 0 : 8, max: 8,
      },
      {
        id: "og", label: "Open Graph tags",
        status: hasOg ? "pass" : "warn",
        detail: hasOg ? "og:title, og:description detected" : "Missing — impacts social sharing",
        points: hasOg ? 6 : 0, max: 6,
      },
      {
        id: "twitter", label: "Twitter Card",
        status: hasTwitter ? "pass" : "warn",
        detail: hasTwitter ? m("twitter:card") : "Missing",
        points: hasTwitter ? 4 : 0, max: 4,
      },
      {
        id: "links", label: "Links",
        status: "pass",
        detail: `${internalLinks} internal · ${externalLinks} external`,
        points: 8, max: 8,
      },
    ];

    const score = Math.round(
      (checks.reduce((s, c) => s + c.points, 0) /
       checks.reduce((s, c) => s + c.max,    0)) * 100
    );

    const data = { url: safe.url.href, score, title, description: desc, wordCount, h1: h1s[0] ?? "", checks };
    cache.set(cacheKey, data);
    return NextResponse.json(data);
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error && e.name === "AbortError" ? "timeout (10s)" : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
