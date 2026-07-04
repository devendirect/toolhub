// Événements GA4 — no-op tant que gtag n'est pas chargé (mode basic : le script
// n'existe qu'après consentement) ou côté serveur
export function track(event: string, params?: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

// Déduit le slug outil de l'URL courante : /en/t/json-formatter → json-formatter,
// /fr/convert/jpg-to-webp → jpg-to-webp
export function toolSlugFromPath(): string {
  const m = window.location.pathname.match(/^\/(?:en|fr)\/(?:t|convert)\/([^/]+)/);
  return m?.[1] ?? "";
}
