"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

const TR = {
  fr: { doublons: "doublons", vides: "vides" },
  en: { doublons: "dedup",    vides: "empty"  },
} as const;

const SAMPLE = `# Database
DATABASE_URL=postgres://user:pass@localhost/db
DATABASE_URL=postgres://user:pass@localhost/db

# App
APP_SECRET=supersecret
DEBUG=true
APP_NAME=MyApp
PORT=3000

# Empty below

UNUSED=`;

interface EnvLine { type: "comment" | "entry" | "empty"; raw: string; key?: string; value?: string; }

function parse(text: string): EnvLine[] {
  return text.split(/\r?\n/).map((raw) => {
    const trimmed = raw.trim();
    if (trimmed.startsWith("#")) return { type: "comment", raw };
    if (!trimmed) return { type: "empty", raw };
    const eq = raw.indexOf("=");
    if (eq === -1) return { type: "entry", raw, key: raw.trim(), value: "" };
    return { type: "entry", raw, key: raw.slice(0, eq).trim(), value: raw.slice(eq + 1) };
  });
}

function format(text: string, opts: { sort: boolean; dedup: boolean; removeEmpty: boolean }): string {
  const lines = parse(text);
  let entries = lines.filter((l): l is EnvLine & { type: "entry" } => l.type === "entry");

  if (opts.dedup) {
    const seen = new Set<string>();
    entries = entries.filter((l) => {
      if (seen.has(l.key!)) return false;
      seen.add(l.key!);
      return true;
    });
  }

  if (opts.removeEmpty) {
    entries = entries.filter((l) => l.value !== "" && l.value !== undefined);
  }

  if (opts.sort) {
    entries.sort((a, b) => (a.key ?? "").localeCompare(b.key ?? ""));
  }

  return entries.map((e) => e.raw).join("\n");
}

export function EnvFormatter() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [sortKeys, setSortKeys] = useState<"on" | "off">("on");
  const [dedup, setDedup] = useState<"on" | "off">("on");
  const [removeEmpty, setRemoveEmpty] = useState<"off" | "on">("off");
  const { copy } = useCopy();

  const output = useMemo(() => format(input, {
    sort: sortKeys === "on",
    dedup: dedup === "on",
    removeEmpty: removeEmpty === "on",
  }), [input, sortKeys, dedup, removeEmpty]);

  const stats = useMemo(() => {
    const lines = parse(input);
    const keys = lines.filter((l) => l.type === "entry");
    const unique = new Set(keys.map((l) => l.key)).size;
    return { total: keys.length, unique };
  }, [input]);

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
        <OptBlock label={i.sortOpt}>
          <SegControl options={["on", "off"]} value={sortKeys} onChange={(v) => setSortKeys(v as typeof sortKeys)} />
        </OptBlock>
        <OptBlock label={TR[lang].doublons}>
          <SegControl options={["on", "off"]} value={dedup} onChange={(v) => setDedup(v as typeof dedup)} />
        </OptBlock>
        <OptBlock label={TR[lang].vides}>
          <SegControl options={["off", "on"]} value={removeEmpty} onChange={(v) => setRemoveEmpty(v as typeof removeEmpty)} />
        </OptBlock>
        <span className="font-mono text-[11px] text-dim">
          {stats.total} {i.keys}{stats.total !== stats.unique ? ` · ${stats.total - stats.unique} dup` : ""}
        </span>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.inputPane}
          ext=".env"
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
          ext=".env"
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
