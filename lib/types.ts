export type Lang = "fr" | "en";
export type Localized = Record<Lang, string>;

export interface Tool {
  slug: string;
  cat: "file" | "dev" | "text" | "design" | "seo";
  glyph: string;
  name: Localized;
  desc: Localized;
  tags: string[];
  runs: number;
  privacy?: "local" | "network";
  comingSoon?: boolean;
}

export interface Category {
  id: "all" | "file" | "dev" | "text" | "design" | "seo";
  label: Localized;
  glyph: string;
}
