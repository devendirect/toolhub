import { NextRequest, NextResponse } from "next/server";

interface IpApiResponse {
  status:      "success" | "fail";
  message?:    string;
  query:       string;
  country:     string;
  countryCode: string;
  region:      string;
  regionName:  string;
  city:        string;
  zip:         string;
  lat:         number;
  lon:         number;
  timezone:    string;
  isp:         string;
  org:         string;
  as:          string;
}

// ── IP validation ────────────────────────────────────────────────────────────
const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function isValidIp(ip: string): boolean {
  const v4 = IPV4_RE.exec(ip);
  if (v4) return v4.slice(1).every((n) => parseInt(n, 10) <= 255);
  // IPv6 : contient ":" et seulement des hex + ":" + éventuellement "."
  return ip.includes(":") && /^[0-9a-fA-F:.]+$/.test(ip) && ip.length <= 45;
}

// ── Cache en mémoire (TTL 1h, max 500 entrées) ───────────────────────────────
// Note : réinitialisé entre les cold starts en environnement serverless.
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_MAX = 500;
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function cacheGet(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}

function cacheSet(key: string, data: unknown) {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// ── Rate limiting (10 req/min par IP requérante) ─────────────────────────────
const RATE_LIMIT  = 10;
const RATE_WINDOW = 60 * 1000;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  // Nettoyage périodique pour éviter la fuite mémoire
  if (rateMap.size > 1000) {
    for (const [k, v] of rateMap) if (now > v.resetAt) rateMap.delete(k);
  }
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Champs demandés à ip-api.com ─────────────────────────────────────────────
const FIELDS = "status,message,query,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as";

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const requesterIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // 1. Rate limiting
  if (!checkRateLimit(requesterIp)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute." },
      { status: 429 }
    );
  }

  // 2. Validation du paramètre IP
  const paramIp = req.nextUrl.searchParams.get("ip")?.trim() ?? "";
  if (paramIp && !isValidIp(paramIp)) {
    return NextResponse.json(
      { error: "Invalid IP address format." },
      { status: 400 }
    );
  }

  // IPs locales/loopback → laisser ip-api.com détecter automatiquement
  const LOCAL_IPS = ["unknown", "::1", "127.0.0.1", "localhost", "::ffff:127.0.0.1"];
  const isLocal = (ip: string) => LOCAL_IPS.includes(ip) || ip.startsWith("::ffff:127.");

  const target = paramIp || (isLocal(requesterIp) ? "" : requesterIp);

  // 3. Cache (uniquement si on a une vraie IP cible)
  if (target) {
    const cached = cacheGet(target);
    if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
  }

  // 4. Appel ip-api.com — sans paramètre = auto-détection par ip-api
  const endpoint = target
    ? `http://ip-api.com/json/${encodeURIComponent(target)}?fields=${FIELDS}`
    : `http://ip-api.com/json/?fields=${FIELDS}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);

    // Quota ip-api.com dépassé
    if (res.status === 429) {
      return NextResponse.json(
        { error: "ip-api.com rate limit reached — try again in a few seconds." },
        { status: 429 }
      );
    }

    if (!res.ok) {
      return NextResponse.json({ error: `ip-api returned ${res.status}` }, { status: 502 });
    }

    const data = await res.json() as IpApiResponse;
    if (data.status === "fail") {
      return NextResponse.json({ error: data.message ?? "lookup failed" }, { status: 422 });
    }

    // 5. Mise en cache (uniquement si on avait une IP cible connue)
    if (target) cacheSet(target, data);

    return NextResponse.json(data);
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error && e.name === "AbortError" ? "timeout" : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
