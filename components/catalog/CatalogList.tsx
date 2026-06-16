import Link from "next/link";
import { CATEGORIES } from "@/lib/tools";
import type { Tool, Lang } from "@/lib/types";
import type { Dict } from "@/lib/i18n";
import { localePath } from "@/lib/localePath";

interface CatalogListProps {
  filtered: Tool[];
  lang: Lang;
  i: Dict;
}

export function CatalogList({ filtered, lang, i }: CatalogListProps) {
  return (
    <div className="min-w-0">
      <div className="hidden md:flex items-center gap-4 px-4 py-[8px] border-b-2 border-line font-mono text-[10px] text-dim-2 uppercase tracking-[0.1em]">
        <span className="w-7 shrink-0">#</span>
        <span className="w-10 shrink-0">icon</span>
        <span className="flex-[2]">name</span>
        <span className="flex-[3]">{lang === "fr" ? "description" : "description"}</span>
        <span className="w-5 shrink-0" />
      </div>

      {filtered.map((tool, idx) => {
        const catLabel = CATEGORIES.find((c) => c.id === tool.cat)?.label[lang] ?? "";
        const soon     = tool.comingSoon;

        const row = (
          <>
            <span className="w-7 font-mono text-[11px] text-dim-2 shrink-0">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className={`w-10 font-mono text-[18px] shrink-0 tracking-[0.05em] transition-colors duration-150 ${soon ? "text-dim" : "text-fg group-hover:text-brand"}`}>
              {tool.glyph}
            </span>
            <span className="flex-[2] min-w-0">
              <span className={`block text-[14px] font-medium tracking-[-0.01em] truncate transition-colors duration-150 ${soon ? "text-fg-1" : "group-hover:text-brand"}`}>
                {tool.name[lang]}
              </span>
              <span className="font-mono text-[11px] text-dim">{catLabel}</span>
            </span>
            <span className="flex-[3] text-[13px] text-fg-1 leading-[1.45] hidden md:block" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}>
              {tool.desc[lang]}
            </span>
            {soon && (
              <span className="w-20 font-mono text-[12px] text-dim text-right shrink-0 hidden md:block">
                <span className="text-[10px] border border-line rounded-[3px] px-[5px] py-[1px] uppercase tracking-[0.06em]">{i.comingSoonLabel}</span>
              </span>
            )}
            <span className={`w-5 font-mono text-[13px] shrink-0 text-right transition-all duration-150 ${soon ? "text-dim-2" : "text-dim group-hover:text-brand group-hover:translate-x-1"}`}>
              {soon ? "…" : "→"}
            </span>
          </>
        );

        if (soon) {
          return (
            <div key={tool.slug} className="group flex items-center gap-4 px-4 py-[13px] border-b border-line opacity-50 cursor-default">
              {row}
            </div>
          );
        }

        return (
          <Link key={tool.slug} href={localePath(lang, `/t/${tool.slug}`)} className="group flex items-center gap-4 px-4 py-[13px] border-b border-line hover:bg-bg-2 transition-colors duration-150">
            {row}
          </Link>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex items-center justify-center py-16 font-mono text-[13px] text-dim">
          {"// "}{lang === "fr" ? "aucun résultat — effacez les filtres." : "no match — try clearing filters."}
        </div>
      )}
    </div>
  );
}
