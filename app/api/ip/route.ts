import { NextResponse } from "next/server";

/**
 * Recherche d'IP désactivée (outil `ip-lookup` en `comingSoon`).
 *
 * L'implémentation interrogeait l'offre gratuite d'ip-api.com, dont les
 * conditions interdisent tout usage commercial — incompatible avec un site
 * financé par la publicité. L'ancien code reste dans l'historique git ; la
 * route répond 503 tant qu'un fournisseur autorisé n'est pas branché
 * (pistes : bases locales DB-IP Lite, IPinfo Lite, ip-api Pro).
 */

export type IpErrorCode =
  | "RATE_LIMITED"
  | "INVALID_IP"
  | "TIMEOUT"
  | "UPSTREAM_ERROR"
  | "LOOKUP_FAILED"
  | "DISABLED";

export function GET() {
  return NextResponse.json(
    { error: "IP lookup is temporarily unavailable.", code: "DISABLED" satisfies IpErrorCode },
    { status: 503 }
  );
}
