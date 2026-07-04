import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { SITE_URL } from "@/lib/brand";

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

  return [...staticRoutes, ...toolRoutes];
}
