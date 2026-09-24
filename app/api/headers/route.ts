import { NextRequest, NextResponse } from "next/server";
import { isSafeUrl, makeRateLimiter, makeCache, getRequesterIp } from "@/lib/route-security";

export interface HeaderCheck {
  name:   string;
  value:  string | null;
  status: "present" | "warn" | "missing";
  note:   string;
}

export interface HeadersData {
  url:    string;
  grade:  "A" | "B" | "C" | "D" | "F";
  server: string | null;
  checks: HeaderCheck[];
}

const rl    = makeRateLimiter(20, 60_000);
// Cache court : on reteste juste après avoir corrigé sa config, un résultat
// vieux de 30 min contredisait la correction. Le rate limit protège déjà les cibles.
const cache = makeCache<HeadersData>(60_000, 500);

type Lang = "fr" | "en";

type NoteSet = {
  csp_missing:  string;
  hsts_warn:    string;
  hsts_missing: string;
  xcto_warn:    string;
  xcto_missing: string;
  xfo_missing:  string;
  rp_warn:      string;
  pp_warn:      string;
};

export const NOTES: Record<Lang, NoteSet> = {
  fr: {
    csp_missing:  "Protège contre les injections XSS. Ajoutez `Content-Security-Policy: default-src 'self'` dans la configuration de votre serveur ou reverse proxy.",
    hsts_warn:    "HSTS ne s'applique qu'aux origines HTTPS. Activez d'abord HTTPS sur ce domaine.",
    hsts_missing: "Force les connexions HTTPS. Ajoutez `Strict-Transport-Security: max-age=31536000; includeSubDomains` à votre serveur.",
    xcto_warn:    'La valeur doit être exactement "nosniff" pour être efficace. Corrigez la valeur actuelle.',
    xcto_missing: "Empêche le navigateur de deviner le type MIME. Ajoutez `X-Content-Type-Options: nosniff` à votre serveur.",
    xfo_missing:  "Protège contre le clickjacking. Ajoutez `X-Frame-Options: DENY` ou utilisez `frame-ancestors 'none'` dans votre CSP.",
    rp_warn:      "Recommandé. Ajoutez `Referrer-Policy: no-referrer-when-downgrade` pour limiter les données envoyées aux sites tiers.",
    pp_warn:      "Optionnel. Ajoutez `Permissions-Policy: camera=(), microphone=(), geolocation=()` pour désactiver les APIs navigateur inutilisées.",
  },
  en: {
    csp_missing:  "Protects against XSS injection. Add `Content-Security-Policy: default-src 'self'` to your server or reverse proxy config.",
    hsts_warn:    "HSTS only applies to HTTPS origins. Enable HTTPS on this domain first.",
    hsts_missing: "Enforces HTTPS connections. Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to your server.",
    xcto_warn:    'Value must be exactly "nosniff" to be effective. Fix the current value.',
    xcto_missing: "Prevents MIME type sniffing. Add `X-Content-Type-Options: nosniff` to your server.",
    xfo_missing:  "Prevents clickjacking attacks. Add `X-Frame-Options: DENY` or use `frame-ancestors 'none'` in your CSP.",
    rp_warn:      "Recommended. Add `Referrer-Policy: no-referrer-when-downgrade` to limit referrer data sent to third-party sites.",
    pp_warn:      "Optional. Add `Permissions-Policy: camera=(), microphone=(), geolocation=()` to disable unused browser APIs.",
  },
};

export const CRITICAL_HEADER_NAMES = ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options"] as const;
const CRITICAL: Set<string> = new Set(CRITICAL_HEADER_NAMES);

export function computeGrade(checks: HeaderCheck[]): HeadersData["grade"] {
  const missing = checks.filter((c) => CRITICAL.has(c.name) && c.status === "missing").length;
  if (missing === 0) return "A";
  if (missing === 1) return "B";
  if (missing === 2) return "C";
  if (missing === 3) return "D";
  return "F";
}

/** `url` = URL finale après redirections : c'est elle qui a servi les en-têtes lus. */
export function analyzeHeaders(headers: Headers, url: URL, n: NoteSet): HeaderCheck[] {
  const h   = (name: string) => headers.get(name);
  const csp  = h("content-security-policy");
  const hsts = h("strict-transport-security");
  const xcto = h("x-content-type-options");
  const xfo  = h("x-frame-options");
  const rp   = h("referrer-policy");
  const pp   = h("permissions-policy");

  return [
    {
      name:   "Content-Security-Policy",
      value:  csp,
      status: csp ? "present" : "missing",
      note:   csp ? "" : n.csp_missing,
    },
    {
      name:   "Strict-Transport-Security",
      value:  hsts,
      status: url.protocol !== "https:" ? "warn" : hsts ? "present" : "missing",
      note:   url.protocol !== "https:" ? n.hsts_warn : hsts ? "" : n.hsts_missing,
    },
    {
      name:   "X-Content-Type-Options",
      value:  xcto,
      status: xcto === "nosniff" ? "present" : xcto ? "warn" : "missing",
      note:   xcto === "nosniff" ? "" : xcto ? n.xcto_warn : n.xcto_missing,
    },
    {
      name:   "X-Frame-Options",
      value:  xfo,
      status: xfo ? "present" : csp?.includes("frame-ancestors") ? "present" : "missing",
      note:   !xfo && !csp?.includes("frame-ancestors") ? n.xfo_missing : "",
    },
    {
      name:   "Referrer-Policy",
      value:  rp,
      status: rp ? "present" : "warn",
      note:   rp ? "" : n.rp_warn,
    },
    {
      name:   "Permissions-Policy",
      value:  pp,
      status: pp ? "present" : "warn",
      note:   pp ? "" : n.pp_warn,
    },
  ];
}

export async function GET(req: NextRequest) {
  const requesterIp = getRequesterIp(req);
  if (!rl(requesterIp)) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  const raw  = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  const safe = isSafeUrl(raw);
  if (!safe.ok) {
    const code = safe.error.includes("private") || safe.error.includes("loopback")
      ? "private_url"
      : "invalid_url";
    return NextResponse.json({ error: code }, { status: 400 });
  }

  const rawLang = req.nextUrl.searchParams.get("lang");
  const lang: Lang = rawLang === "fr" ? "fr" : "en";

  const cacheKey = `${safe.url.href}:${lang}`;
  const cached = cache.get(cacheKey);
  if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(safe.url.href, {
      method:   "HEAD",
      signal:   controller.signal,
      headers:  { "User-Agent": "Mozilla/5.0 (compatible; utilisio-bot/1.0)" },
      redirect: "follow",
    });
    clearTimeout(timer);

    // HSTS se juge sur l'URL finale : http://site → https://site doit être noté en HTTPS
    const finalUrl = new URL(res.url || safe.url.href);
    const checks = analyzeHeaders(res.headers, finalUrl, NOTES[lang]);
    const data: HeadersData = {
      url:    finalUrl.href,
      grade:  computeGrade(checks),
      server: res.headers.get("server"),
      checks,
    };

    cache.set(cacheKey, data);
    return NextResponse.json(data);
  } catch (e) {
    clearTimeout(timer);
    const isTimeout = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout ? "timeout" : "network_error" },
      { status: 502 }
    );
  }
}
