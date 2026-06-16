"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

type Mode = "space" | "remove" | "normalize";

const SAMPLE = `Voici un texte
avec plusieurs
sauts de ligne.

Et un paragraphe vide.
Ainsi qu'une   ligne   avec   des espaces multiples.`;

export function RemoveLineBreaks() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>("space");

  const output = useMemo(() => {
    if (!input) return "";
    switch (mode) {
      case "space":     return input.replace(/\r?\n+/g, " ").replace(/ {2,}/g, " ").trim();
      case "remove":    return input.replace(/\r?\n/g, "").trim();
      case "normalize": return input.replace(/\r?\n{2,}/g, "\n\n").replace(/\r?\n/g, " ").replace(/ {2,}/g, " ").trim();
    }
  }, [input, mode]);

  const { copy } = useCopy();
  const handleCopy = () => output && copy(output);

  const MODE_LABELS: Record<Mode, string> = {
    space:     lang === "fr" ? "→ espace"   : "→ space",
    remove:    lang === "fr" ? "supprimer"  : "remove",
    normalize: lang === "fr" ? "normaliser" : "normalize",
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40"
          >
            {lang === "fr" ? "copier ⏎" : "copy ⏎"}
          </button>
        }
      >
        <OptBlock label="mode">
          <SegControl
            options={["space", "remove", "normalize"] as Mode[]}
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          />
        </OptBlock>
        <span className="font-mono text-[11px] text-dim">{MODE_LABELS[mode]}</span>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.input}
          ext="txt"
          meta={`${input.split(/\r?\n/).length} ${lang === "fr" ? "lignes" : "lines"}`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>{input.length} chars</span>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full min-h-[320px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={i.output}
          ext="txt"
          meta={output ? `${output.length} chars` : undefined}
          actions={<PaneBtn onClick={handleCopy} disabled={!output}>{i.copy}</PaneBtn>}
          footer={output ? <span>{lang === "fr" ? "traité" : "processed"} ✓</span> : undefined}
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[320px]">
              {output || <span className="text-dim-2">{lang === "fr" ? "résultat ici…" : "result here…"}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
