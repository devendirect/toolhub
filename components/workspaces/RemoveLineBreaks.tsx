"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { useTrackRun } from "@/hooks/useTrackRun";

type Mode = "space" | "remove" | "normalize";

const TR = {
  fr: {
    modeSpace:     "→ espace",
    modeRemove:    "supprimer",
    modeNormalize: "normaliser",
    processed:     "traité",
  },
  en: {
    modeSpace:     "→ space",
    modeRemove:    "remove",
    modeNormalize: "normalize",
    processed:     "processed",
  },
} as const;

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
  const trackRun = useTrackRun("remove-linebreaks", "text");
  const handleCopy = () => { if (output) { trackRun(); copy(output); } };

  const MODE_LABELS: Record<Mode, string> = {
    space:     TR[lang].modeSpace,
    remove:    TR[lang].modeRemove,
    normalize: TR[lang].modeNormalize,
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
            {i.copyAlt}
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
          meta={`${input.split(/\r?\n/).length} ${i.lines}`}
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
          footer={output ? <span>{TR[lang].processed} ✓</span> : undefined}
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[320px]">
              {output || <span className="text-dim-2">{i.resultHere}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
