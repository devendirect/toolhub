export const BRAND_NAME = "utilisio";
export const BRAND_VERSION = "0.1.0";
export const BRAND_TAGLINE = {
  fr: "Boîte à outils en ligne, sans friction.",
  en: "Online toolkit. Zero friction.",
} as const;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilisio.com").replace(/\/$/, "");
