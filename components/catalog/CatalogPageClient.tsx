"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers/I18nProvider";
import { localePath } from "@/lib/localePath";
import { t } from "@/lib/i18n";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { PromptBar } from "@/components/brand/PromptBar";
import { StatBlock } from "@/components/home/StatBlock";
import { CatalogSidebar } from "./CatalogSidebar";
import { CatalogList } from "./CatalogList";

type Sort = "popularity" | "name";

export function CatalogPageClient({ initialCat = "all" }: { initialCat?: string }) {
  const { lang } = useLang();
  const i = t(lang);
  const { favorites } = useFavorites();

  const [activeCat, setActiveCat] = useState(initialCat);
  const [sort, setSort] = useState<Sort>("popularity");
  const [q, setQ] = useState("");

  const catObj = CATEGORIES.find((c) => c.id === activeCat) ?? CATEGORIES[0]!;

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return TOOLS
      .filter((tool) => {
        if (activeCat === "favorites") return favorites.includes(tool.slug);
        return activeCat === "all" || tool.cat === activeCat;
      })
      .filter((tool) =>
        !ql ||
        tool.name[lang].toLowerCase().includes(ql) ||
        tool.tags.some((x) => x.includes(ql))
      )
      .sort((a, b) =>
        sort === "name" ? a.name[lang].localeCompare(b.name[lang]) : b.runs - a.runs
      );
  }, [activeCat, sort, q, lang, favorites]);

  return (
    <div className="pt-9">

      {/* Breadcrumb */}
      <div className="mb-7">
        <PromptBar text={i.promptCat(catObj.label[lang].toLowerCase())} />
        <div className="flex gap-[6px] font-mono text-[12px] text-dim mt-2 pl-[18px]">
          <Link href={localePath(lang, "/")} className="hover:text-brand transition-colors">~</Link>
          <span>/</span>
          <Link href={localePath(lang, "/tools")} className="hover:text-brand transition-colors" onClick={() => setActiveCat("all")}>tools</Link>
          {activeCat !== "all" && (
            <>
              <span>/</span>
              <span className="text-brand">{catObj.label[lang].toLowerCase()}</span>
            </>
          )}
        </div>
      </div>

      {/* Head */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 py-6 border-y border-line mb-8">
        <div>
          <div className="font-mono text-[32px] text-brand tracking-[0.08em] leading-none mb-[10px]">
            {catObj.glyph}
          </div>
          <h1 className="text-[36px] font-medium tracking-[-0.025em] leading-none mb-2">
            {activeCat === "all" ? (lang === "fr" ? "Tous les outils" : "All tools") : catObj.label[lang]}
          </h1>
          <p className="text-fg-1 text-[15px] max-w-[60ch]">
            {activeCat === "all"
              ? i.catalogAll
              : i.catalogCat(catObj.label[lang].toLowerCase())}
          </p>
        </div>
        <div className="border border-line">
          <StatBlock label={i.totalTools} value={String(filtered.length)} />
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 pb-12">
        <CatalogSidebar
          lang={lang}
          i={i}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          sort={sort}
          setSort={setSort}
          q={q}
          setQ={setQ}
          favoritesCount={favorites.length}
        />
        <CatalogList filtered={filtered} lang={lang} i={i} />
      </div>

    </div>
  );
}
