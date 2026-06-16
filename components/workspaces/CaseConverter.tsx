"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

type Case = "upper" | "lower" | "title" | "camel" | "pascal" | "snake" | "kebab";

const SAMPLE = "Hello World from toolhub — the developer toolkit";

function splitWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function convert(str: string, mode: Case): string {
  if (!str) return "";
  const words = splitWords(str);
  switch (mode) {
    case "upper":  return str.toUpperCase();
    case "lower":  return str.toLowerCase();
    case "title":  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    case "camel":  return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "pascal": return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "snake":  return words.map((w) => w.toLowerCase()).join("_");
    case "kebab":  return words.map((w) => w.toLowerCase()).join("-");
  }
}

const CASES: Case[] = ["upper", "lower", "title", "camel", "pascal", "snake", "kebab"];

export function CaseConverter() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<Case>("camel");

  const output = useMemo(() => convert(input, mode), [input, mode]);

  const { copy } = useCopy();
  const handleCopy = () => output && copy(output);

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
        <OptBlock label="case">
          <SegControl options={CASES} value={mode} onChange={(v) => setMode(v as Case)} />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.input}
          ext="txt"
          meta={`${input.length} chars`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>{lang === "fr" ? "texte original" : "original text"}</span>}
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
          footer={output ? <span>{mode}Case ✓</span> : undefined}
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap break-all min-h-[320px]">
              {output || <span className="text-dim-2">{lang === "fr" ? "résultat ici…" : "result here…"}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
