import type { Tool } from "./types";
import type { ToolContent } from "./tools-content";
import { SITE_URL, BRAND_NAME, BRAND_TAGLINE } from "./brand";
import { toolFaqItems } from "./faq";

// Échappe "<" pour empêcher un "</script>" contenu dans les données de casser la page
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const CAT_APPLICATION: Record<string, string> = {
  file:   "UtilitiesApplication",
  dev:    "DeveloperApplication",
  text:   "UtilitiesApplication",
  design: "DesignApplication",
  seo:    "BusinessApplication",
};

export function toolJsonLd(tool: Tool, lang: "en" | "fr", content?: ToolContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name[lang],
    description: tool.desc[lang],
    url: `${SITE_URL}/${lang}/t/${tool.slug}`,
    applicationCategory: CAT_APPLICATION[tool.cat] ?? "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: lang === "fr" ? "fr-FR" : "en",
    ...(content ? { featureList: content.useCases[lang] } : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    provider: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(tool: Tool, lang: "en" | "fr", catLabel: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: BRAND_NAME,
        item: `${SITE_URL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: catLabel,
        item: `${SITE_URL}/${lang}/tools/${tool.cat}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name[lang],
        item: `${SITE_URL}/${lang}/t/${tool.slug}`,
      },
    ],
  };
}

export function faqJsonLd(tool: Tool, lang: "en" | "fr") {
  const items = toolFaqItems(tool);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q[lang],
      acceptedAnswer: { "@type": "Answer", text: item.a[lang] },
    })),
  };
}

export function websiteJsonLd(lang: "en" | "fr") {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BRAND_NAME,
      url: SITE_URL,
      description: BRAND_TAGLINE[lang],
      inLanguage: lang === "fr" ? "fr-FR" : "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
  ];
}
