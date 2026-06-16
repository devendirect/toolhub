import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/brand";

const indexing = process.env.INDEXING_ENABLED === "true";

export default function robots(): MetadataRoute.Robots {
  if (!indexing) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
