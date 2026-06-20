import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { makeRateLimiter, makeCache, getRequesterIp } from "@/lib/route-security";
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
const cache     = makeCache<MetaData>(30 * 60 * 1000, 200); // 30 min, 200 URLs


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

  cache.set(cacheKey, data);
  return NextResponse.json(data);
}
