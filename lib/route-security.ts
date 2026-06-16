// Utilitaires de sécurité partagés entre les Route Handlers

// ── SSRF protection ───────────────────────────────────────────────────────────
const PRIVATE_HOSTNAMES = /^(localhost|127\.\d+\.\d+\.\d+|::1|0\.0\.0\.0)$/i;
const PRIVATE_RANGES = [
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/,   // link-local / AWS metadata
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d+\.\d+$/, // CGNAT
];
const PRIVATE_TLDS = /\.(local|internal|intranet|corp|lan)$/i;

export function isSafeUrl(raw: string): { ok: true; url: URL } | { ok: false; error: string } {
  let url: URL;
  try { url = new URL(raw); } catch {
    return { ok: false, error: "invalid URL" };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return { ok: false, error: "only http/https allowed" };
  }

  const host = url.hostname;

  if (PRIVATE_HOSTNAMES.test(host)) {
    return { ok: false, error: "private/loopback addresses are not allowed" };
  }
  if (PRIVATE_RANGES.some((re) => re.test(host))) {
    return { ok: false, error: "private IP ranges are not allowed" };
  }
  if (PRIVATE_TLDS.test(host)) {
    return { ok: false, error: "private TLDs are not allowed" };
  }

  return { ok: true, url };
}

// ── Rate limiting en mémoire ──────────────────────────────────────────────────
export function makeRateLimiter(limit: number, windowMs: number) {
  const map = new Map<string, { count: number; resetAt: number }>();

  return function check(ip: string): boolean {
    const now = Date.now();
    if (map.size > 1000) {
      for (const [k, v] of map) if (now > v.resetAt) map.delete(k);
    }
    const entry = map.get(ip);
    if (!entry || now > entry.resetAt) {
      map.set(ip, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count++;
    return true;
  };
}

// ── Cache en mémoire ──────────────────────────────────────────────────────────
export function makeCache<T>(ttlMs: number, maxSize: number) {
  const map = new Map<string, { data: T; expiresAt: number }>();

  return {
    get(key: string): T | null {
      const entry = map.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) { map.delete(key); return null; }
      return entry.data;
    },
    set(key: string, data: T) {
      if (map.size >= maxSize) {
        const oldest = map.keys().next().value;
        if (oldest) map.delete(oldest);
      }
      map.set(key, { data, expiresAt: Date.now() + ttlMs });
    },
  };
}

// ── Limite de taille de réponse ───────────────────────────────────────────────
export const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 Mo

// Vérification rapide via Content-Length (peut être absent sur les réponses chunked)
export function checkResponseSize(res: Response): string | null {
  const len = res.headers.get("content-length");
  if (len && parseInt(len, 10) > MAX_RESPONSE_BYTES) {
    return `response too large (${Math.round(parseInt(len, 10) / 1024)}KB > 5MB)`;
  }
  return null;
}

// Vérification post-lecture pour les réponses sans Content-Length
export function checkTextSize(text: string): string | null {
  // Approximation : 1 char JS ≈ 1-4 bytes UTF-8 ; on utilise la longueur comme proxy
  if (text.length > MAX_RESPONSE_BYTES) {
    return `response too large (>${Math.round(MAX_RESPONSE_BYTES / 1024 / 1024)}MB)`;
  }
  return null;
}

// ── Requester IP ─────────────────────────────────────────────────────────────
export function getRequesterIp(req: Request): string {
  const fwd = (req.headers as Headers).get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim()
    ?? (req.headers as Headers).get("x-real-ip")
    ?? "unknown";
}
