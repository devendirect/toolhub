"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { t } from "@/lib/i18n";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: {
    separator:       "séparateur",
    textLabel:       "texte",
    slugPlaceholder: "titre ou texte à convertir…",
    slugHere:        "slug ici…",
    defaultInput:    "Mon article de blog, Été 2025",
  },
  en: {
    separator:       "separator",
    textLabel:       "text",
    slugPlaceholder: "title or text to convert…",
    slugHere:        "slug here…",
    defaultInput:    "My Blog Post, Summer 2025",
  },
} as const;

function toSlug(text: string, sep: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, sep);
}

export function SlugGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState<string>(TR[lang].defaultInput);
  const [sep, setSep] = useState<"-" | "_">("-");
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("slug-generator", "text");

  const slug = useMemo(() => toSlug(input, sep), [input, sep]);

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => { if (slug) { trackRun(); copy(slug); } }}
            disabled={!slug}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40"
          >
            {copied ? "✓" : i.copyAlt}
          </button>
        }
      >
        <OptBlock label={TR[lang].separator}>
          <SegControl options={["-", "_"]} value={sep} onChange={(v) => setSep(v as typeof sep)} />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        <div className="flex items-center gap-0 border-b border-line">
          <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">
            {TR[lang].textLabel}
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={TR[lang].slugPlaceholder}
            className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
            spellCheck={false}
          />
        </div>

        <div
          className="px-[18px] py-[18px] bg-bg-code cursor-pointer group"
          onClick={() => { if (slug) { trackRun(); copy(slug); } }}
        >
          {slug ? (
            <>
              <p className="font-mono text-[16px] text-brand leading-[1.5] break-all">{slug}</p>
              <p className="font-mono text-[11px] text-dim mt-2">
                {i.clickToCopy} · {slug.length} chars
              </p>
            </>
          ) : (
            <p className="font-mono text-[13px] text-dim-2">
              {TR[lang].slugHere}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
