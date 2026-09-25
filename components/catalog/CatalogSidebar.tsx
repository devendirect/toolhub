"use client";

import Link from "next/link";
import { TOOLS, CATEGORIES, POPULAR_TAGS } from "@/lib/tools";
import { localePath } from "@/lib/localePath";
import type { Lang } from "@/lib/types";
import type { Dict } from "@/lib/i18n";

type Sort = "popularity" | "name";

interface CatalogSidebarProps {
  lang: Lang;
  i: Dict;
  activeCat: string;
  setActiveCat: (cat: string) => void;
  sort: Sort;
  setSort: (sort: Sort) => void;
  q: string;
  setQ: (q: string) => void;
  favoritesCount: number;
}

export function CatalogSidebar({
  lang, i, activeCat, setActiveCat, sort, setSort, q, setQ, favoritesCount,
}: CatalogSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">

      {/* Search */}
      <div>
        <div className="font-mono text-[11px] text-dim uppercase tracking-[0.1em] mb-3">{"// filters"}</div>
        <div className="flex items-center gap-2 px-3 py-[9px] border border-line bg-bg-1">
          <span className="font-mono text-[12px] text-dim">{">"}</span>
          <input
            className="flex-1 bg-transparent font-mono text-[12px] text-fg outline-none placeholder:text-dim-2"
            placeholder={i.searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            spellCheck={false}
          />
          {q && (
            <button onClick={() => setQ("")} className="font-mono text-[11px] text-dim hover:text-fg transition-colors">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="font-mono text-[11px] text-dim uppercase tracking-[0.1em] mb-2">{i.catLabel}</div>
        <ul className="flex flex-col border border-line">
          {favoritesCount > 0 && (
            <li className="border-b border-line">
              <button
                onClick={() => setActiveCat("favorites")}
                className={`w-full flex items-center gap-[10px] px-3 py-[9px] font-mono text-[12px] transition-colors duration-150 border-l-2 ${
                  activeCat === "favorites"
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-transparent text-fg-1 hover:bg-bg-2 hover:text-fg"
                }`}
              >
                <span className="w-7 text-[11px] shrink-0">★</span>
                <span className="flex-1 text-left">{i.favoritesSection}</span>
                <span className={activeCat === "favorites" ? "text-brand" : "text-dim-2"}>{favoritesCount}</span>
              </button>
            </li>
          )}
          {CATEGORIES.map((c) => {
            const live  = TOOLS.filter((x) => !x.comingSoon);
            const count = c.id === "all" ? live.length : live.filter((x) => x.cat === c.id).length;
            const isOn  = activeCat === c.id;
            return (
              <li key={c.id} className="border-b border-line last:border-b-0">
                {/* Vrai lien : l'URL suit la catégorie et les robots voient le maillage entre hubs */}
                <Link
                  href={localePath(lang, c.id === "all" ? "/tools" : `/tools/${c.id}`)}
                  onClick={() => setActiveCat(c.id)}
                  aria-current={isOn ? "page" : undefined}
                  className={`w-full flex items-center gap-[10px] px-3 py-[9px] font-mono text-[12px] transition-colors duration-150 border-l-2 ${
                    isOn
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-transparent text-fg-1 hover:bg-bg-2 hover:text-fg"
                  }`}
                >
                  <span className="w-7 text-[11px] shrink-0">{c.glyph}</span>
                  <span className="flex-1 text-left">{c.label[lang]}</span>
                  <span className={isOn ? "text-brand" : "text-dim-2"}>{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <div className="font-mono text-[11px] text-dim uppercase tracking-[0.1em] mb-2">{i.sortBy}</div>
        <div className="flex flex-col border border-line">
          {([{ key: "popularity", label: i.sortPop }, { key: "name", label: i.sortName }] satisfies { key: Sort; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`text-left px-3 py-[9px] font-mono text-[12px] border-b border-line last:border-b-0 transition-colors duration-150 ${
                sort === key ? "text-brand bg-brand-soft" : "text-fg-1 hover:bg-bg-2 hover:text-fg"
              }`}
            >
              <span className="mr-2 text-[10px]">{sort === key ? "●" : "○"}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular tags */}
      <div>
        <div className="font-mono text-[11px] text-dim uppercase tracking-[0.1em] mb-2">{i.popularTags}</div>
        <div className="flex flex-wrap gap-[6px]">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQ(q === tag ? "" : tag)}
              className={`font-mono text-[11px] px-[8px] py-[3px] border transition-colors duration-150 ${
                q === tag
                  ? "border-brand text-brand bg-brand-soft"
                  : "border-line text-dim hover:border-line-2 hover:text-fg-1"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
