"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { useTrackRun } from "@/hooks/useTrackRun";

type Mode = "chars" | "words" | "lines";

const SAMPLE = "Hello, World!\nUtilisio is fast.";

export function reverseText(input: string, mode: Mode): string {
  if (!input) return "";
  switch (mode) {
    case "chars": return Array.from(input).reverse().join("");
    case "words": return input.split(/\r?\n/).map((line) => line.split(" ").reverse().join(" ")).join("\n");
    case "lines": return input.split(/\r?\n/).reverse().join("\n");
  }
}

export function TextReverser() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>("chars");

  const output = useMemo(() => reverseText(input, mode), [input, mode]);

  const { copy } = useCopy();
  const trackRun = useTrackRun("text-reverser", "text");
  const handleCopy = () => { if (output) { trackRun(); copy(output); } };

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
            options={["chars", "words", "lines"] as Mode[]}
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.input}
          ext="txt"
          meta={`${Array.from(input).length} chars`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>{input.split(/\r?\n/).length} {i.lines}</span>}
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
          meta={output ? `${Array.from(output).length} chars` : undefined}
          actions={<PaneBtn onClick={handleCopy} disabled={!output}>{i.copy}</PaneBtn>}
          footer={output ? <span>reversed by {mode} ✓</span> : undefined}
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
