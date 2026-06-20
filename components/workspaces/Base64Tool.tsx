"use client";

import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { useBidirectionalConverter } from "@/hooks/useBidirectionalConverter";

type Mode = "encode" | "decode";

const TR = {
  fr: {
    plainText:      "texte brut",
    encodePlaceholder: "texte à encoder…",
    decodePlaceholder: "base64 à décoder…",
    resultAppears:  "le résultat apparaît ici…",
    converted:      "converti",
  },
  en: {
    plainText:      "plain text",
    encodePlaceholder: "text to encode…",
    decodePlaceholder: "base64 to decode…",
    resultAppears:  "result appears here…",
    converted:      "converted",
  },
} as const;

function encodeB64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary);
}

function decodeB64(str: string): string {
  const binary = atob(str.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
  const { lang } = useLang();
  const i = t(lang);
  const { mode, setMode, input, setInput, output, error, swap } = useBidirectionalConverter(encodeB64, decodeB64, "Hello, toolhub!");
  const { copy } = useCopy();

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={swap}
            disabled={!output}
            className="px-[18px] py-2 border border-line-2 bg-bg-1 font-mono text-[12px] text-fg-1 rounded-[3px] hover:border-brand-mid hover:text-fg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {i.swapBtn}
          </button>
        }
      >
        <OptBlock label="mode">
          <SegControl
            options={["encode", "decode"]}
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={mode === "encode" ? TR[lang].plainText : "base64"}
          ext="txt"
          meta={`${new TextEncoder().encode(input).length} ${i.bytes}`}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={
            <span>
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-brand mr-[6px]" />
              {mode === "encode" ? "utf-8" : "base64"}
            </span>
          }
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode"
                ? TR[lang].encodePlaceholder
                : TR[lang].decodePlaceholder}
              className="w-full h-full min-h-[320px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={mode === "encode" ? "base64" : TR[lang].plainText}
          ext="txt"
          meta={output ? `${output.length} chars` : undefined}
          actions={
            <PaneBtn onClick={() => output && copy(output)} disabled={!output}>{i.copy}</PaneBtn>
          }
          footer={
            error ? (
              <span className="text-danger">✕ {error}</span>
            ) : output ? (
              <span>{TR[lang].converted} ✓</span>
            ) : undefined
          }
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap break-all min-h-[320px]">
              {error
                ? <span className="text-danger">{error}</span>
                : output || <span className="text-dim-2">{TR[lang].resultAppears}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
