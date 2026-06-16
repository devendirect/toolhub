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

const checkRate = makeRateLimiter(10, 60_000);
const cache     = makeCache<object>(30 * 60 * 1000, 200); // 30 min, 200 URLs

function metaContent($: cheerio.CheerioAPI, name: string): string {
  return (
    $(`meta[name="${name}"]`).attr("content") ??
    $(`meta[property="${name}"]`).attr("content") ??
    ""
  );
}

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

  const cacheKey = safe.url.origin + safe.url.pathname;

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

    const data = {
      url:            safe.url.origin + safe.url.pathname,
      title:          $("title").first().text().trim(),
      description:    metaContent($, "description"),
      ogTitle:        metaContent($, "og:title"),
      ogDescription:  metaContent($, "og:description"),
      ogImage:        metaContent($, "og:image"),
      ogUrl:          metaContent($, "og:url"),
      ogType:         metaContent($, "og:type"),
      ogSiteName:     metaContent($, "og:site_name"),
      twitterCard:    metaContent($, "twitter:card"),
      twitterTitle:   metaContent($, "twitter:title"),
      twitterDesc:    metaContent($, "twitter:description"),
      twitterImage:   metaContent($, "twitter:image"),
      canonical:      $('link[rel="canonical"]').attr("href") ?? "",
      robots:         metaContent($, "robots"),
      favicon:        $('link[rel="icon"], link[rel="shortcut icon"]').first().attr("href") ?? "",
    };

    cache.set(cacheKey, data);
    return NextResponse.json(data);
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error && e.name === "AbortError" ? "timeout (10s)" : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
