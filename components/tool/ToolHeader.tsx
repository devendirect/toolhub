"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers/I18nProvider";
import { localePath } from "@/lib/localePath";
import { t } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/tools";
import { PromptBar } from "@/components/brand/PromptBar";
import { TrustSignals } from "./TrustSignals";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import type { Tool } from "@/lib/types";

export function ToolHeader({ tool }: { tool: Tool }) {
  const { lang } = useLang();
  const i = t(lang);
  const catLabel = CATEGORIES.find((c) => c.id === tool.cat)?.label[lang] ?? "";
  const [shared, setShared] = useState(false);
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(tool.slug);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: tool.name[lang], url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // clipboard denied — silent fallback, no crash
      }
    }
  };

  return (
    <header className="mb-7">
      {/* Breadcrumb */}
      <div className="mb-7">
        <PromptBar text={`~/tools/${tool.slug} $ run`} />
        <div className="flex gap-[6px] font-mono text-[12px] text-dim mt-2 pl-[18px]">
          <Link href={localePath(lang, "/")} className="hover:text-brand transition-colors">~</Link>
          <span>/</span>
          <Link href={localePath(lang, "/tools")} className="hover:text-brand transition-colors">tools</Link>
          <span>/</span>
          {/* Même chemin que le BreadcrumbList JSON-LD : accueil › catégorie › outil */}
          <Link href={localePath(lang, `/tools/${tool.cat}`)} className="hover:text-brand transition-colors">{catLabel.toLowerCase()}</Link>
          <span>/</span>
          <span className="text-brand">{tool.slug}</span>
        </div>
      </div>

      {/* Tool head */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 py-6 border-y border-line">
        <div>
          <div className="font-mono text-[32px] text-brand tracking-[0.08em] leading-none mb-[10px]">
            {tool.glyph}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-dim mb-[14px]">
            <span>{catLabel}</span>
            <span className="text-dim-2">·</span>
            <span className="text-hot tracking-[0.05em] text-[11px]">{i.fast}</span>
          </div>
          <h1 className="text-[36px] font-medium tracking-[-0.025em] leading-none mb-2">
            {tool.name[lang]}
          </h1>
          <p className="text-fg-1 text-[15px] max-w-[60ch] mb-[18px]">{tool.desc[lang]}</p>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-[14px] py-[7px] border border-line-2 bg-bg-1 rounded-[3px] font-mono text-[12px] text-fg-1 hover:border-brand-mid hover:text-fg transition-colors duration-150"
            >
              <span>⌘</span>{" "}
              {shared ? i.shareCopied : i.shareLabel}
            </button>
            <button
              onClick={() => toggle(tool.slug)}
              className={`inline-flex items-center gap-2 px-[14px] py-[7px] border rounded-[3px] font-mono text-[12px] transition-colors duration-150 ${
                fav
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line-2 bg-bg-1 text-fg-1 hover:border-brand-mid hover:text-fg"
              }`}
            >
              <span>{fav ? "★" : "☆"}</span>
              {i.bookmarkLabel}
            </button>
          </div>
        </div>

        <TrustSignals privacy={tool.privacy} lang={lang} />
      </div>
    </header>
  );
}
