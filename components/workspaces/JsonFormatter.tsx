"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl, Toggle } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { Editor } from "@/components/workspace/Editor";

const SAMPLE = `{"user":{"id":42,"name":"Ada Lovelace","email":"ada@example.com","roles":["admin","engineer"],"meta":{"created_at":"2026-04-18T09:14:00Z","plan":"pro","seats":12}},"projects":[{"slug":"toolhub","status":"active"},{"slug":"engine","status":"archived"}]}`;

function sortDeep(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v !== null && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, val]) => [k, sortDeep(val)])
    );
  }
  return v;
}

function countKeys(v: unknown): number {
  if (Array.isArray(v)) return v.reduce<number>((s, i) => s + countKeys(i), 0);
  if (v !== null && typeof v === "object") {
    const entries = Object.entries(v as Record<string, unknown>);
    return entries.length + entries.reduce<number>((s, [, val]) => s + countKeys(val), 0);
  }
  return 0;
}

export function JsonFormatter() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState<number | "tab">(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [minify, setMinify] = useState(false);

  const { output, error, parsed } = useMemo(() => {
    try {
      const p = JSON.parse(input);
      const val = sortKeys ? sortDeep(p) : p;
      const spaces = indent === "tab" ? "\t" : indent;
      const out = minify ? JSON.stringify(val) : JSON.stringify(val, null, spaces);
      return { output: out, error: null, parsed: p };
    } catch (e) {
      return { output: "", error: (e as Error).message, parsed: null };
    }
  }, [input, indent, sortKeys, minify]);

  const handlePasteSample = () => setInput(SAMPLE);
  const handleClear = () => setInput("");
  const { copy } = useCopy();
  const handleCopy = () => output && copy(output);
  const handleDownload = () => {
    if (!output) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "application/json" }));
    a.download = "formatted.json";
    a.click();
  };

  const outputLines = output ? output.split("\n").length : 0;
  const outputKeys  = parsed ? countKeys(parsed) : 0;

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
            onClick={() => setInput((v) => { try { return JSON.stringify(JSON.parse(v), null, indent === "tab" ? "\t" : indent); } catch { return v; } })}
          >
            format ⏎
          </button>
        }
      >
        <OptBlock label={i.indent}>
          <SegControl options={[2, 4, 8, "tab"]} value={indent} onChange={(v) => setIndent(v as number | "tab")} />
        </OptBlock>
        <OptBlock label={i.sortKeys}>
          <Toggle on={sortKeys} onChange={setSortKeys} />
        </OptBlock>
        <OptBlock label={i.minify}>
          <Toggle on={minify} onChange={setMinify} />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* Input pane */}
        <Pane
          title={i.input}
          ext="json"
          meta={`${new TextEncoder().encode(input).length} ${i.bytes}`}
          actions={
            <>
              <PaneBtn onClick={handlePasteSample}>{i.paste}</PaneBtn>
              <PaneBtn onClick={handleClear}>{i.clear}</PaneBtn>
            </>
          }
          footer={
            error ? (
              <span className="text-danger">✕ {error}</span>
            ) : (
              <>
                <span>
                  <span className="inline-block w-[6px] h-[6px] rounded-full bg-brand mr-[6px]" style={{ boxShadow: "0 0 6px var(--brand)" }} />
                  {i.valid}
                </span>
                <span>utf-8</span>
                <span>ln 1, col {input.length}</span>
              </>
            )
          }
          className="border-r border-line"
        >
          <Editor value={input} onChange={setInput} />
        </Pane>

        {/* Output pane */}
        <Pane
          title={i.output}
          ext="json"
          meta={output ? `${new TextEncoder().encode(output).length} ${i.bytes} · ${outputLines} ${i.lines} · ${outputKeys} ${i.keys}` : undefined}
          actions={
            <>
              <PaneBtn onClick={handleCopy}>{i.copy}</PaneBtn>
              <PaneBtn onClick={handleDownload}>{i.download}</PaneBtn>
            </>
          }
          footer={
            output ? (
              <>
                <span>indent: {indent === "tab" ? "tab" : `${indent} spaces`}</span>
                <span>sorted: {sortKeys ? "yes" : "no"}</span>
                <span>{lang === "fr" ? "généré" : "rendered"} ✓</span>
              </>
            ) : undefined
          }
        >
          <Editor value={output} readOnly />
        </Pane>
      </div>
    </section>
  );
}
