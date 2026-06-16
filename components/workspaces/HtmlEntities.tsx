"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

type Mode = "encode" | "decode";

const SAMPLE_ENCODE = `<h1>Bonjour & bienvenue</h1>\n<p>Prix : "10€" — <strong>offre limitée</strong></p>`;
const SAMPLE_DECODE = `&lt;h1&gt;Bonjour &amp; bienvenue&lt;/h1&gt;\n&lt;p&gt;Prix&nbsp;: &quot;10&euro;&quot; &mdash; &lt;strong&gt;offre limit&eacute;e&lt;/strong&gt;&lt;/p&gt;`;

function encodeEntities(str: string): string {
  const el = document.createElement("textarea");
  el.textContent = str;
  return el.innerHTML;
}

function decodeEntities(str: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
}

export function HtmlEntities() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE_ENCODE);
  const [mode, setMode] = useState<Mode>("encode");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };
    if (typeof document === "undefined") return { output: "", error: null };
    try {
      const out = mode === "encode" ? encodeEntities(input) : decodeEntities(input);
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
          title={mode === "encode" ? (lang === "fr" ? "texte brut" : "plain text") : "HTML entities"}
          ext="html"
          meta={`${input.length} chars`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>{mode === "encode" ? "raw" : "entities"}</span>}
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
          title={mode === "encode" ? "HTML entities" : (lang === "fr" ? "texte brut" : "plain text")}
          ext="html"
          meta={output ? `${output.length} chars` : undefined}
          actions={<PaneBtn onClick={handleCopy} disabled={!output}>{i.copy}</PaneBtn>}
          footer={
            error
              ? <span className="text-danger">✕ {error}</span>
              : output ? <span>{mode}d ✓</span> : undefined
          }
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[320px]">
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
