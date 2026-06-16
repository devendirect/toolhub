import { NextRequest, NextResponse } from "next/server";
import { LANGS, isValidLang } from "@/lib/localePath";

const DEFAULT_LANG = "en";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass through API routes and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Already prefixed with a valid lang → pass through
  const firstSegment = pathname.split("/")[1] ?? "";
  if (isValidLang(firstSegment)) {
    return NextResponse.next();
  }

  // Detect preferred lang from cookie, then Accept-Language header
  const cookieLang = req.cookies.get("lang")?.value;
  const acceptLang = req.headers.get("accept-language") ?? "";
  const preferred =
    (cookieLang && isValidLang(cookieLang) ? cookieLang : null) ??
    (acceptLang.toLowerCase().startsWith("fr") ? "fr" : DEFAULT_LANG);

  const newUrl = req.nextUrl.clone();
  newUrl.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(newUrl, { status: 302 });
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)", "/"],
};
