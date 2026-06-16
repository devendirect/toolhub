"use client";

import { useLang } from "@/components/providers/I18nProvider";
import { usePalette } from "@/components/providers/PaletteProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { t } from "@/lib/i18n";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { densityGridCols } from "@/lib/theme";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/home/HomeSections";
import { SectionHead } from "@/components/home/SectionHead";
import { ToolCard } from "@/components/home/ToolCard";

export function HomeClient() {
  const { lang }    = useLang();
  const { setOpen } = usePalette();
  const { density } = useTheme();
  const i           = t(lang);
  const { favorites } = useFavorites();
  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.slug));

  return (
    <div className="pt-10">

      <HomeHero lang={lang} i={i} onSearchClick={() => setOpen(true)} />

      {/* Favoris */}
      {favoriteTools.length > 0 && (
        <section className="mb-10">
          <SectionHead
            label={
              <>
                <span className="text-brand mr-1">★</span>
                {`// ${i.favoritesSection} `}
                <span className="text-hot">{favoriteTools.length}</span>
              </>
            }
          />
          <div className={`grid ${densityGridCols(density)} border border-line`}>
            {favoriteTools.map((tool) => {
              const catLabel = CATEGORIES.find((c) => c.id === tool.cat)?.label[lang] ?? "";
              return <ToolCard key={tool.slug} tool={tool} lang={lang} catLabel={catLabel} />;
            })}
          </div>
        </section>
      )}

      <HomeSections />

    </div>
  );
}
