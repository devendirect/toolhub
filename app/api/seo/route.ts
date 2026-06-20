import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { makeRateLimiter, makeCache, getRequesterIp } from "@/lib/route-security";
import { fetchPageHtml } from "@/lib/api-html-fetch";

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

const checkRate = makeRateLimiter(10, 60_000);
const cache     = makeCache<SeoData>(30 * 60 * 1000, 200); // 30 min, 200 URLs

export async function GET(req: NextRequest) {
  const requesterIp = getRequesterIp(req);
  if (!checkRate(requesterIp)) {
    return NextResponse.json({ error: "Too many requests — please wait a minute." }, { status: 429 });
  }

  const raw = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!raw) return NextResponse.json({ error: "missing url" }, { status: 400 });

  const fetched = await fetchPageHtml(raw);
  if (!fetched.ok) return fetched.response;

  const cacheKey = fetched.url.href;
  const cached = cache.get(cacheKey);
  if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });

  const $ = cheerio.load(fetched.html);

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
  const origin     = fetched.url.origin;
  const internalLinks = $(`a[href^="/"], a[href^="${origin}"]`).length;
  const externalLinks = $("a[href^='http']").not(`[href^="${origin}"]`).length;

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

  const data: SeoData = { url: fetched.url.href, score, title, description: desc, wordCount, h1: h1s[0] ?? "", checks };
  cache.set(cacheKey, data);
  return NextResponse.json(data);
}
