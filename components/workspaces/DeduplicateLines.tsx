"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

const TR = {
  fr: {
    caseLabel:    "casse",
    dupsRemoved:  "doublon(s) supprimé(s)",
    uniqueLines:  "lignes uniques",
  },
  en: {
    caseLabel:    "case",
    dupsRemoved:  "duplicate(s) removed",
    uniqueLines:  "unique lines",
  },
} as const;

const SAMPLE = `apple\nbanana\napple\norange\nbanana\ngrape\norange`;

export function DeduplicateLines() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [caseMode, setCaseMode] = useState<"sensitive" | "insensitive">("sensitive");
  const { copy } = useCopy();

  const output = useMemo(() => {
    if (!input) return "";
    const lines = input.split(/\r?\n/);
    const seen = new Set<string>();
    return lines
      .filter((line) => {
        const key = caseMode === "insensitive" ? line.toLowerCase() : line;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .join("\n");
  }, [input, caseMode]);

  const stats = useMemo(() => {
    const total = input.split(/\r?\n/).length;
    const unique = output.split(/\r?\n/).filter(Boolean).length;
    return { total, removed: total - unique };
  }, [input, output]);

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => output && copy(output)}
            disabled={!output}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40"
          >
            {i.copyAlt}
          </button>
        }
      >
        <OptBlock label={TR[lang].caseLabel}>
          <SegControl
            options={["sensitive", "insensitive"]}
            value={caseMode}
            onChange={(v) => setCaseMode(v as typeof caseMode)}
          />
        </OptBlock>
        {stats.removed > 0 && (
          <span className="font-mono text-[11px] text-dim">
            {stats.removed} {TR[lang].dupsRemoved}
          </span>
        )}
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.inputPane}
          ext="txt"
          meta={`${input.split(/\r?\n/).length} ${i.lines}`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clearInput}</PaneBtn>}
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
          title={i.outputPane}
          ext="txt"
          meta={output ? `${output.split(/\r?\n/).filter(Boolean).length} ${TR[lang].uniqueLines}` : undefined}
          actions={<PaneBtn onClick={() => copy(output)} disabled={!output}>{i.copy}</PaneBtn>}
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
