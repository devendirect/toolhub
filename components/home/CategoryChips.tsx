"use client";

import { CATEGORIES, TOOLS } from "@/lib/tools";
import type { Lang, Category } from "@/lib/types";

interface CategoryChipsProps {
  lang: Lang;
  active: Category["id"];
  onChange: (id: Category["id"]) => void;
}

export function CategoryChips({ lang, active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const count = cat.id === "all" ? TOOLS.length : TOOLS.filter((t) => t.cat === cat.id).length;
        const isOn = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`inline-flex items-center gap-2 px-[14px] py-[8px] border rounded-full text-[13px] transition-all duration-150 ${
              isOn
                ? "border-brand bg-brand-soft text-fg"
                : "border-line bg-bg-1 text-fg-1 hover:border-line-2 hover:text-fg"
            }`}
          >
            <span className={`font-mono text-[12px] ${isOn ? "text-brand" : "text-brand"}`}>
              {cat.glyph}
            </span>
            <span>{cat.label[lang]}</span>
            <span className={`font-mono text-[11px] border-l pl-[6px] ml-[2px] ${isOn ? "border-brand-mid text-brand" : "border-line-2 text-dim"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
