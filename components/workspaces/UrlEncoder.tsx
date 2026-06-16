"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

type Mode = "encode" | "decode";

const SAMPLE_ENCODE = "https://example.com/search?q=hello world&lang=fr&emoji=🚀";
const SAMPLE_DECODE = "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Dfr%26emoji%3D%F0%9F%9A%80";

export function UrlEncoder() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE_ENCODE);
  const [mode, setMode] = useState<Mode>("encode");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };
    try {
      const out = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
      return { output: out, error: null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, mode]);

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  };
  const { copy } = useCopy();
  const handleCopy = () => output && copy(output);

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleSwap}
            disabled={!output}
            className="px-[18px] py-2 border border-line-2 bg-bg-1 font-mono text-[12px] text-fg-1 rounded-[3px] hover:border-brand-mid hover:text-fg transition-colors disabled:opacity-40"
          >
            {lang === "fr" ? "inverser ⇄" : "swap ⇄"}
          </button>
        }
      >
        <OptBlock label="mode">
          <SegControl
            options={["encode", "decode"] as Mode[]}
            value={mode}
            onChange={(v) => {
              setMode(v as Mode);
              setInput(v === "encode" ? SAMPLE_ENCODE : SAMPLE_DECODE);
            }}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={mode === "encode" ? (lang === "fr" ? "URL brute" : "raw URL") : "encoded"}
          ext="txt"
          meta={`${input.length} chars`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>utf-8</span>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full min-h-[320px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none break-all"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={mode === "encode" ? "encoded" : (lang === "fr" ? "URL brute" : "raw URL")}
          ext="txt"
          meta={output ? `${output.length} chars` : undefined}
          actions={<PaneBtn onClick={handleCopy} disabled={!output}>{i.copy}</PaneBtn>}
          footer={
            error
              ? <span className="text-danger">✕ {error}</span>
              : output ? <span>{mode}d ✓</span> : undefined
          }
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap break-all min-h-[320px]">
              {error
                ? <span className="text-danger">{error}</span>
                : output || <span className="text-dim-2">{lang === "fr" ? "résultat ici…" : "result here…"}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
