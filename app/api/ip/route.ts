import { NextRequest, NextResponse } from "next/server";
import { makeRateLimiter, makeCache, getRequesterIp } from "@/lib/route-security";

export type IpErrorCode =
  | "RATE_LIMITED"
  | "INVALID_IP"
  | "TIMEOUT"
  | "UPSTREAM_ERROR"
  | "LOOKUP_FAILED";

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
  return ip.includes(":") && /^[0-9a-fA-F:.]+$/.test(ip) && ip.length <= 45;
}

const checkRateLimit = makeRateLimiter(10, 60_000);
const cache          = makeCache<IpApiResponse>(60 * 60 * 1000, 500);

// ── Champs demandés à ip-api.com ─────────────────────────────────────────────
const FIELDS = "status,message,query,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as";

function ipErr(code: IpErrorCode, error: string) {
  return { error, code };
}

export async function GET(req: NextRequest) {
  const requesterIp = getRequesterIp(req);

  if (!checkRateLimit(requesterIp)) {
    return NextResponse.json(
      ipErr("RATE_LIMITED", "Too many requests — please wait a minute."),
      { status: 429 }
    );
  }

  const paramIp = req.nextUrl.searchParams.get("ip")?.trim() ?? "";
  if (paramIp && !isValidIp(paramIp)) {
    return NextResponse.json(
      ipErr("INVALID_IP", "Invalid IP address format."),
      { status: 400 }
    );
  }

  const LOCAL_IPS = ["unknown", "::1", "127.0.0.1", "localhost", "::ffff:127.0.0.1"];
  const isLocal = (ip: string) => LOCAL_IPS.includes(ip) || ip.startsWith("::ffff:127.");

  const target = paramIp || (isLocal(requesterIp) ? "" : requesterIp);

  if (target) {
    const cached = cache.get(target);
    if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
  }

  const endpoint = target
    ? `http://ip-api.com/json/${encodeURIComponent(target)}?fields=${FIELDS}`
    : `http://ip-api.com/json/?fields=${FIELDS}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);

    if (res.status === 429) {
      return NextResponse.json(
        ipErr("RATE_LIMITED", "ip-api.com rate limit reached — try again in a few seconds."),
        { status: 429 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        ipErr("UPSTREAM_ERROR", `ip-api returned ${res.status}`),
        { status: 502 }
      );
    }

    const data = await res.json() as IpApiResponse;
    if (data.status === "fail") {
      return NextResponse.json(
        ipErr("LOOKUP_FAILED", data.message ?? "lookup failed"),
        { status: 422 }
      );
    }

    if (target) cache.set(target, data);

    return NextResponse.json(data);
  } catch (e) {
    clearTimeout(timer);
    const isTimeout = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      ipErr(isTimeout ? "TIMEOUT" : "UPSTREAM_ERROR", isTimeout ? "timeout" : String(e)),
      { status: 502 }
    );
  }
}
