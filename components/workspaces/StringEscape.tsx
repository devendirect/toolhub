"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

const TR = {
  fr: { direction: "direction" },
  en: { direction: "direction" },
} as const;

type Lang2 = "js" | "sql" | "bash";
type Dir = "escape" | "unescape";

function processJs(text: string, dir: Dir): string {
  if (dir === "escape") {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
  }
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function processSql(text: string, dir: Dir): string {
  if (dir === "escape") return text.replace(/'/g, "''").replace(/\\/g, "\\\\");
  return text.replace(/''/g, "'").replace(/\\\\/g, "\\");
}

function processBash(text: string, dir: Dir): string {
  if (dir === "escape") {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\$/g, "\\$")
      .replace(/`/g, "\\`");
  }
  return text
    .replace(/\\"/g, '"')
    .replace(/\\\$/g, "$")
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\");
}

export function StringEscape() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(`Hello "world"\nIt's a test\tvalue`);
  const [mode, setMode] = useState<Lang2>("js");
  const [dir, setDir] = useState<Dir>("escape");
  const { copy } = useCopy();

  const output = useMemo(() => {
    if (!input) return "";
    switch (mode) {
      case "js":   return processJs(input, dir);
      case "sql":  return processSql(input, dir);
      case "bash": return processBash(input, dir);
    }
  }, [input, mode, dir]);

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
        <OptBlock label={i.languageOpt}>
          <SegControl options={["js", "sql", "bash"]} value={mode} onChange={(v) => setMode(v as Lang2)} />
        </OptBlock>
        <OptBlock label={TR[lang].direction}>
          <SegControl options={["escape", "unescape"]} value={dir} onChange={(v) => setDir(v as Dir)} />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.inputPane}
          ext="txt"
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
          ext={mode}
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
