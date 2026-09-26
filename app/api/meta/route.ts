import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { makeRateLimiter, makeCache, getRequesterIp, isSafeUrl } from "@/lib/route-security";
import { fetchPageHtml } from "@/lib/api-html-fetch";
import { extractMeta } from "@/lib/api-html-parse";

export interface MetaData {
  url: string; title: string; description: string;
  ogTitle: string; ogDescription: string; ogImage: string;
  ogUrl: string; ogType: string; ogSiteName: string;
  twitterCard: string; twitterTitle: string; twitterDesc: string; twitterImage: string;
  canonical: string; robots: string; favicon: string;
}

const checkRate = makeRateLimiter(10, 60_000);
// 1 min : on revérifie juste après avoir corrigé ses balises
const cache     = makeCache<MetaData>(60_000, 200);


export async function GET(req: NextRequest) {
  const requesterIp = getRequesterIp(req);
  if (!checkRate(requesterIp)) {
    return NextResponse.json({ error: "Too many requests, please wait a minute." }, { status: 429 });
  }

  const raw = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!raw) return NextResponse.json({ error: "missing url" }, { status: 400 });

  // Cache consulté avant le fetch : sinon il ne protégeait pas la cible
  const safe = isSafeUrl(raw);
  const cached = safe.ok ? cache.get(safe.url.href) : undefined;
  if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });

  const fetched = await fetchPageHtml(raw);
  if (!fetched.ok) return fetched.response;

  const $ = cheerio.load(fetched.html);

  const data: MetaData = {
    url:           fetched.url.href,
    title:         $("title").first().text().trim(),
    description:   extractMeta($, "description"),
    ogTitle:       extractMeta($, "og:title"),
    ogDescription: extractMeta($, "og:description"),
    ogImage:       extractMeta($, "og:image"),
    ogUrl:         extractMeta($, "og:url"),
    ogType:        extractMeta($, "og:type"),
    ogSiteName:    extractMeta($, "og:site_name"),
    twitterCard:   extractMeta($, "twitter:card"),
    twitterTitle:  extractMeta($, "twitter:title"),
    twitterDesc:   extractMeta($, "twitter:description"),
    twitterImage:  extractMeta($, "twitter:image"),
    canonical:     $('link[rel="canonical"]').attr("href") ?? "",
    robots:        extractMeta($, "robots"),
    favicon:       $('link[rel="icon"], link[rel="shortcut icon"]').first().attr("href") ?? "",
  };

  cache.set(fetched.url.href, data);
  return NextResponse.json(data);
}
