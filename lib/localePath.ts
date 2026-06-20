import type { Lang } from "@/lib/types";

export const LANGS = ["en", "fr"] as const;

export function isValidLang(lang: string): lang is Lang {
  return (LANGS as readonly string[]).includes(lang);
}

export function coerceLang(s: string): Lang {
  return isValidLang(s) ? s : "en";
}

/** Builds a locale-aware path. Both EN and FR get an explicit prefix. */
export function localePath(lang: Lang, path: string): string {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}
