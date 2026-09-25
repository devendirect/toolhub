import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { CONVERT_PAIRS } from "@/lib/convert-pairs";
import { PDF_PAIRS } from "@/lib/pdf-pairs";
import { SITE_URL } from "@/lib/brand";
import { GUIDES } from "@/lib/guides";

const LANGS = ["en", "fr"] as const;
const CATEGORY_SLUGS = ["file", "dev", "text", "design", "seo"] as const;

// x-default n'existe pas dans MetadataRoute.Sitemap — il reste porté par les <link> du HTML
function alternates(enPath: string, frPath: string) {
  return {
    languages: {
      en: `${SITE_URL}${enPath}`,
      fr: `${SITE_URL}${frPath}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = LANGS.flatMap((lang) => [
    {
      url: `${SITE_URL}/${lang}`,
      changeFrequency: "weekly" as const,
      priority: lang === "en" ? 1 : 0.95,
      alternates: alternates("/en", "/fr"),
    },
    {
      url: `${SITE_URL}/${lang}/tools`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: alternates("/en/tools", "/fr/tools"),
    },
    {
      url: `${SITE_URL}/${lang}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: alternates("/en/about", "/fr/about"),
    },
    {
      url: `${SITE_URL}/${lang}/guides`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: alternates("/en/guides", "/fr/guides"),
    },
    {
      url: `${SITE_URL}/${lang}/contact`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
      alternates: alternates("/en/contact", "/fr/contact"),
    },
    {
      url: `${SITE_URL}/${lang}/faq`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: alternates("/en/faq", "/fr/faq"),
    },
    {
      url: `${SITE_URL}/${lang}/privacy`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: alternates("/en/privacy", "/fr/privacy"),
    },
    {
      url: `${SITE_URL}/${lang}/terms`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: alternates("/en/terms", "/fr/terms"),
    },
    ...CATEGORY_SLUGS.map((cat) => ({
      url: `${SITE_URL}/${lang}/tools/${cat}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternates(`/en/tools/${cat}`, `/fr/tools/${cat}`),
    })),
  ]);

  const toolRoutes: MetadataRoute.Sitemap = TOOLS
    .filter((t) => !t.comingSoon)
    .flatMap((t) =>
      LANGS.map((lang) => ({
        url: `${SITE_URL}/${lang}/t/${t.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: alternates(`/en/t/${t.slug}`, `/fr/t/${t.slug}`),
      }))
    );

  // Pilote pSEO : uniquement les paires retenues dans lib/convert-pairs.ts + lib/pdf-pairs.ts
  const convertRoutes: MetadataRoute.Sitemap = [...CONVERT_PAIRS, ...PDF_PAIRS].flatMap((p) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}/convert/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: alternates(`/en/convert/${p.slug}`, `/fr/convert/${p.slug}`),
    }))
  );

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.flatMap((g) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}/guides/${g.slug}`,
      lastModified: g.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternates(`/en/guides/${g.slug}`, `/fr/guides/${g.slug}`),
    }))
  );

  return [...staticRoutes, ...toolRoutes, ...convertRoutes, ...guideRoutes];
}
