"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

type Mode = "encode" | "decode";

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

  const [input, setInput] = useState("Hello, toolhub!");
  const [mode, setMode] = useState<Mode>("encode");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };
    try {
      return { output: mode === "encode" ? encodeB64(input) : decodeB64(input), error: null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, mode]);

  const { copy } = useCopy();
  const handleCopy = () => output && copy(output);
  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleSwap}
            disabled={!output}
            className="px-[18px] py-2 border border-line-2 bg-bg-1 font-mono text-[12px] text-fg-1 rounded-[3px] hover:border-brand-mid hover:text-fg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {lang === "fr" ? "inverser ⇄" : "swap ⇄"}
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
        {/* Input */}
        <Pane
          title={mode === "encode" ? (lang === "fr" ? "texte brut" : "plain text") : "base64"}
          ext="txt"
          meta={`${new TextEncoder().encode(input).length} ${i.bytes}`}
          actions={
            <>
              <PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>
            </>
          }
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
                ? (lang === "fr" ? "texte à encoder…" : "text to encode…")
                : (lang === "fr" ? "base64 à décoder…" : "base64 to decode…")}
              className="w-full h-full min-h-[320px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
              spellCheck={false}
            />
          </div>
        </Pane>

        {/* Output */}
        <Pane
          title={mode === "encode" ? "base64" : (lang === "fr" ? "texte brut" : "plain text")}
          ext="txt"
          meta={output ? `${output.length} chars` : undefined}
          actions={
            <PaneBtn onClick={handleCopy} disabled={!output}>{i.copy}</PaneBtn>
          }
          footer={
            error ? (
              <span className="text-danger">✕ {error}</span>
            ) : output ? (
              <span>{lang === "fr" ? "converti" : "converted"} ✓</span>
            ) : undefined
          }
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap break-all min-h-[320px]">
              {error
                ? <span className="text-danger">{error}</span>
                : output || <span className="text-dim-2">{lang === "fr" ? "le résultat apparaît ici…" : "result appears here…"}</span>}
            </pre>
          </div>
        </Pane>
      </div>
    </section>
  );
}
