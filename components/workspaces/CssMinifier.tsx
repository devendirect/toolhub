"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

const TR = {
  fr: { cssSource: "CSS source", cssMinified: "CSS minifié" },
  en: { cssSource: "source CSS", cssMinified: "minified CSS" },
} as const;

const RE_COMMENTS   = /\/\*[\s\S]*?\*\//g;
const RE_AROUND_SYN = /\s*([{};:,>~+])\s*/g;
const RE_WHITESPACE = /\s+/g;
const RE_LAST_SEMI  = /;\}/g;
const RE_NEWLINES   = /\n/g;

function minifyCss(css: string): string {
  return css
    .replace(RE_COMMENTS,   "")
    .replace(RE_AROUND_SYN, "$1")
    .replace(RE_WHITESPACE, " ")
    .replace(RE_LAST_SEMI,  "}")
    .replace(RE_NEWLINES,   "")
    .trim();
}

const SAMPLE = `/* Main layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Typography */
h1,
h2,
h3 {
  font-weight: 600;
  line-height: 1.3;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .container {
    padding: 0 12px;
  }
}`;

export function CssMinifier() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const { copy } = useCopy();

  const output = useMemo(() => (input.trim() ? minifyCss(input) : ""), [input]);

  const savings = useMemo(() => {
    if (!input || !output) return null;
    const pct = Math.round((1 - output.length / input.length) * 100);
    return { original: input.length, minified: output.length, pct };
  }, [input, output]);

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={TR[lang].cssSource}
          ext="css"
          meta={`${input.length} chars`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clearInput}</PaneBtn>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full min-h-[360px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={TR[lang].cssMinified}
          ext="min.css"
          meta={savings ? `${savings.pct}% saved` : undefined}
          actions={<PaneBtn onClick={() => output && copy(output)} disabled={!output}>{i.copy}</PaneBtn>}
          footer={savings ? (
            <span>
              {savings.original} → {savings.minified} chars
            </span>
          ) : undefined}
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[360px] break-all">
              {output || <span className="text-dim-2">{i.resultHere}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
