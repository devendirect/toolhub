"use client";

import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { useBidirectionalConverter } from "@/hooks/useBidirectionalConverter";
import { useTrackRun } from "@/hooks/useTrackRun";
import { encodeEntities, decodeEntities } from "@/lib/html-entities";

type Mode = "encode" | "decode";


const SAMPLE_ENCODE = `<h1>Bonjour & bienvenue</h1>\n<p>Prix : "10€" — <strong>offre limitée</strong></p>`;
const SAMPLE_DECODE = `&lt;h1&gt;Bonjour &amp; bienvenue&lt;/h1&gt;\n&lt;p&gt;Prix&nbsp;: &quot;10&euro;&quot; &mdash; &lt;strong&gt;offre limit&eacute;e&lt;/strong&gt;&lt;/p&gt;`;

export function HtmlEntities() {
  const { lang } = useLang();
  const i = t(lang);
  const { mode, setMode, input, setInput, output, error, swap } = useBidirectionalConverter(
    encodeEntities,
    decodeEntities,
    SAMPLE_ENCODE,
  );
  const { copy } = useCopy();
  const trackRun = useTrackRun("html-entities", "text");

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={swap}
            disabled={!output}
            className="px-[18px] py-2 border border-line-2 bg-bg-1 font-mono text-[12px] text-fg-1 rounded-[3px] hover:border-brand-mid hover:text-fg transition-colors disabled:opacity-40"
          >
            {i.swapBtn}
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
          title={mode === "encode" ? i.plainText : "HTML entities"}
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
          title={mode === "encode" ? "HTML entities" : i.plainText}
          ext="html"
          meta={output ? `${output.length} chars` : undefined}
          actions={<PaneBtn onClick={() => { if (output) { trackRun(); copy(output); } }} disabled={!output}>{i.copy}</PaneBtn>}
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
                : output || <span className="text-dim-2">{i.resultHere}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
