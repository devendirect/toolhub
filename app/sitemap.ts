import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const LANGS = ["en", "fr"] as const;
const CATEGORY_SLUGS = ["file", "dev", "text", "design", "seo"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = LANGS.flatMap((lang) => [
    {
      url: `${SITE_URL}/${lang}`,
      changeFrequency: "weekly" as const,
      priority: lang === "en" ? 1 : 0.95,
    },
    {
      url: `${SITE_URL}/${lang}/tools`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...CATEGORY_SLUGS.map((cat) => ({
      url: `${SITE_URL}/${lang}/tools/${cat}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]);

  const toolRoutes: MetadataRoute.Sitemap = TOOLS
    .filter((t) => !t.comingSoon)
    .flatMap((t) =>
      LANGS.map((lang) => ({
        url: `${SITE_URL}/${lang}/t/${t.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    );

  return [...staticRoutes, ...toolRoutes];
}
