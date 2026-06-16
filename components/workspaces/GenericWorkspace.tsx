"use client";

import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/tools";
import type { Tool } from "@/lib/types";

export function GenericWorkspace({ tool }: { tool: Tool }) {
  const { lang } = useLang();
  const i = t(lang);
  const catLabel = CATEGORIES.find((c) => c.id === tool.cat)?.label[lang] ?? "";

  return (
    <section className="mb-10">
      {/* Options stub */}
      <div className="flex items-center gap-6 px-[18px] py-[14px] border border-line bg-bg-1 border-b-0">
        <div className="flex items-center gap-[10px] text-[12px]">
          <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
            {lang === "fr" ? "catégorie" : "category"}
          </span>
          <span className="font-mono text-[12px] text-fg-1">{catLabel}</span>
        </div>
        <div className="flex-1" />
        <button disabled className="px-[18px] py-2 bg-brand/50 text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] cursor-not-allowed opacity-50">
          {lang === "fr" ? "lancer ⏎" : "run ⏎"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* Input stub */}
        <div className="flex flex-col border-r border-line">
          <div className="flex items-center gap-[14px] px-[14px] py-[10px] border-b border-line bg-bg">
            <span className="font-mono text-[12px]">
              <span className="text-dim">// </span><span className="text-fg">{i.input}</span>
            </span>
            <span className="font-mono text-[11px] text-dim ml-auto">{tool.slug}</span>
          </div>
          <div className="flex-1 flex flex-col bg-bg-code p-[18px]">
            <div className="flex items-baseline gap-2 font-mono text-[13px] mb-6">
              <span className="text-brand">{">"}</span>
              <span className="text-dim">{lang === "fr" ? "votre entrée ici…" : "your input here…"}</span>
            </div>
            <div className="flex flex-col gap-[10px]">
              {tool.tags.map((tag) => (
                <div key={tag} className="flex justify-between py-[10px] border-b border-dashed border-line font-mono text-[13px]">
                  <span className="text-dim">#{tag}</span>
                  <span className="text-dim-2">—</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output stub */}
        <div className="flex flex-col">
          <div className="flex items-center gap-[14px] px-[14px] py-[10px] border-b border-line bg-bg">
            <span className="font-mono text-[12px]">
              <span className="text-dim">// </span><span className="text-fg">{i.output}</span>
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-[10px] p-10 bg-bg-code text-center min-h-[380px]">
            <div className="font-mono text-[40px] text-brand tracking-[0.1em] mb-[6px]">{tool.glyph}</div>
            <div className="text-[18px] font-medium tracking-[-0.015em]">{tool.name[lang]}</div>
            <div className="font-mono text-[12px] text-dim">
              {"// "}{lang === "fr" ? "interface dédiée en cours de design" : "dedicated UI in design"}
            </div>
            <p className="text-[13px] text-fg-1 max-w-[38ch] leading-[1.55] mt-2">
              {lang === "fr"
                ? "L'outil est catalogué et prêt à être maquetté. Le moteur tourne déjà côté navigateur."
                : "Tool is cataloged and ready to be designed. The engine already runs client-side."}
            </p>
            <div className="flex gap-2 mt-3">
              {[lang === "fr" ? "spécifié" : "specced", i.inBrowser].map((label) => (
                <span key={label} className="inline-flex items-center gap-[6px] px-[10px] py-1 border border-line-2 bg-bg rounded-full font-mono text-[11px] text-fg-1">
                  <span className="w-[5px] h-[5px] rounded-full bg-brand shrink-0" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
            <span><span className="inline-block w-[6px] h-[6px] rounded-full bg-brand mr-[6px]" />
              {lang === "fr" ? "planifié" : "queued"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
