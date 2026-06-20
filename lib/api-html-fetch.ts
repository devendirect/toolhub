import { NextResponse } from "next/server";
import { isSafeUrl, checkResponseSize, checkTextSize } from "@/lib/route-security";

export type HtmlFetchResult =
  | { ok: false; response: NextResponse }
  | { ok: true; html: string; url: URL };

export async function fetchPageHtml(raw: string): Promise<HtmlFetchResult> {
  const safe = isSafeUrl(raw);
  if (!safe.ok) {
    return { ok: false, response: NextResponse.json({ error: safe.error }, { status: 400 }) };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(raw, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; utilisio-bot/1.0)" },
    });
    clearTimeout(timer);

    const sizeError = checkResponseSize(res);
    if (sizeError) {
      return { ok: false, response: NextResponse.json({ error: sizeError }, { status: 413 }) };
    }

    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) {
      return { ok: false, response: NextResponse.json({ error: "response is not HTML" }, { status: 422 }) };
    }

    const html = await res.text();
    const textSizeError = checkTextSize(html);
    if (textSizeError) {
      return { ok: false, response: NextResponse.json({ error: textSizeError }, { status: 413 }) };
    }

    return { ok: true, html, url: safe.url };
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error && e.name === "AbortError" ? "timeout (10s)" : String(e);
    return { ok: false, response: NextResponse.json({ error: msg }, { status: 502 }) };
  }
}
