"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { t } from "@/lib/i18n";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import type { Category } from "@/lib/types";
import { SectionHead } from "./SectionHead";
import { CategoryChips } from "./CategoryChips";
import { FeaturedCard } from "./FeaturedCard";
import { CategorySection } from "./CategorySection";

const FEATURED_SLUG = "json-formatter";

export function HomeSections() {
  const { lang } = useLang();
  const { density } = useTheme();
  const i = t(lang);
  const [activeCat, setActiveCat] = useState<Category["id"]>("all");

  const featured = TOOLS.find((t) => t.slug === FEATURED_SLUG) ?? TOOLS[0]!;

  const sections =
    activeCat === "all"
      ? CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
          cat: c,
          tools: TOOLS.filter((t) => t.cat === c.id),
        }))
      : [
          {
            cat: CATEGORIES.find((c) => c.id === activeCat)!,
            tools: TOOLS.filter((t) => t.cat === activeCat),
          },
        ];

  return (
    <>
      {/* Category chips */}
      <section className="mb-8">
        <SectionHead label={`// ${i.catLabel.toLowerCase()}`} />
        <CategoryChips lang={lang} active={activeCat} onChange={setActiveCat} />
      </section>

      {/* Featured */}
      {activeCat === "all" && (
        <section className="mb-8">
          <SectionHead label={`// ${i.featured.toLowerCase()}`} />
          <FeaturedCard
            tool={featured}
            lang={lang}
            catLabel={CATEGORIES.find((c) => c.id === featured.cat)?.label[lang] ?? ""}
            openLabel={i.open}
            mostUsedLabel={i.mostUsed}
          />
        </section>
      )}

      {/* Tool sections */}
      {sections.map(({ cat, tools }) => (
        <CategorySection
          key={cat.id}
          cat={cat}
          tools={tools}
          lang={lang}
          density={density}
          viewAllLabel={i.viewAll}
        />
      ))}
    </>
  );
}
