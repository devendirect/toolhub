"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { downloadBlob } from "@/lib/download";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: {
    viewLabel:      "vue",
    renderedLabel:  "rendu",
    downloadHtml:   "télécharger .html ⏎",
  },
  en: {
    viewLabel:      "view",
    renderedLabel:  "rendered",
    downloadHtml:   "download .html ⏎",
  },
} as const;

type View = "preview" | "html";

const SAMPLE = `# Hello, toolhub!

Un **formatter** Markdown vers HTML. Supporte :

- *italique* et **gras**
- \`code inline\` et blocs de code
- [liens](https://toolhub.io) et images
- Listes ordonnées et non-ordonnées
- > Citations en bloc

## Code

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("toolhub"));
\`\`\`

---

> Tout est traité localement dans votre navigateur.`;

export function MarkdownHtml() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [view, setView] = useState<View>("preview");

  const html = useMemo(() => {
    if (typeof window === "undefined" || !input) return "";
    try {
      const { marked } = require("marked");
      return marked.parse(input) as string;
    } catch {
      return "";
    }
  }, [input]);

  const { copy } = useCopy();
  const trackRun = useTrackRun("markdown-html", "dev");
  const handleCopy = () => copy(view === "html" ? html : input);
  const handleDownload = () => {
    if (!html) return;
    trackRun();
    downloadBlob(new Blob([html], { type: "text/html" }), "output.html");
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleDownload}
            disabled={!html}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40"
          >
            {TR[lang].downloadHtml}
          </button>
        }
      >
        <OptBlock label={TR[lang].viewLabel}>
          <SegControl
            options={["preview", "html"] as View[]}
            value={view}
            onChange={(v) => setView(v as View)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* Input — Markdown */}
        <Pane
          title="markdown"
          ext="md"
          meta={`${wordCount} ${i.wordsLabel}`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>{input.length} chars</span>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="# Your markdown here…"
              className="w-full h-full min-h-[420px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
              spellCheck={false}
            />
          </div>
        </Pane>

        {/* Output — Preview or HTML */}
        <Pane
          title={view === "preview" ? "preview" : "html"}
          ext={view === "preview" ? "html" : "txt"}
          meta={html ? `${html.length} chars` : undefined}
          actions={<PaneBtn onClick={handleCopy} disabled={!html}>{i.copy}</PaneBtn>}
          footer={html ? <span>marked · {TR[lang].renderedLabel} ✓</span> : undefined}
        >
          <div className="flex-1 bg-bg-code min-h-[420px] overflow-auto">
            {view === "preview" ? (
              <div
                className="p-[18px] prose-toolhub"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="p-[14px] font-mono text-[12px] text-fg-1 leading-[1.6] whitespace-pre-wrap break-all">
                {html || <span className="text-dim-2">{i.resultHere}</span>}
              </pre>
            )}
          </div>
        </Pane>
      </div>
    </section>
  );
}
