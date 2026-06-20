"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { useTrackRun } from "@/hooks/useTrackRun";

type Align = "left" | "center" | "right";

const TR = {
  fr: {
    addRow: "+ ligne",
    addCol: "+ colonne",
    rmRow:  "− ligne",
    rmCol:  "− colonne",
    output: "markdown",
  },
  en: {
    addRow: "+ row",
    addCol: "+ column",
    rmRow:  "− row",
    rmCol:  "− column",
    output: "markdown",
  },
} as const;

const ALIGN_ICON: Record<Align, string> = { left: "←", center: "⊝", right: "→" };
const ALIGN_CYCLE: Record<Align, Align>  = { left: "center", center: "right", right: "left" };

export function toMarkdown(rows: string[][], aligns: readonly Align[]): string {
  const cols  = rows[0]?.length ?? 0;
  const cell  = (s: string) => ` ${s.replace(/\|/g, "\\|").replace(/\n/g, " ")} `;
  const sepOf = (a: Align)  => a === "center" ? ":---:" : a === "right" ? "---:" : ":---";
  const row   = (cells: string[]) => `|${cells.map(cell).join("|")}|`;
  return [
    row(rows[0] ?? []),
    `|${aligns.slice(0, cols).map(sepOf).join("|")}|`,
    ...rows.slice(1).map(row),
  ].join("\n");
}

export function MarkdownTable() {
  const { lang } = useLang();
  const i = t(lang);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("md-table", "dev");

  const [rows, setRows] = useState<string[][]>([
    ["Header 1", "Header 2", "Header 3"],
    ["Cell A",   "Cell B",   "Cell C"  ],
    ["Cell D",   "Cell E",   "Cell F"  ],
  ]);
  const [aligns, setAligns] = useState<Align[]>(["left", "center", "right"]);

  const cols = rows[0]?.length ?? 0;

  const setCell = (r: number, c: number, v: string) =>
    setRows((prev) => prev.map((row, ri) =>
      ri === r ? row.map((cell, ci) => ci === c ? v : cell) : row
    ));

  const addRow = () =>
    setRows((prev) => [...prev, Array<string>(cols).fill("")]);

  const removeRow = () =>
    setRows((prev) => prev.length > 1 ? prev.slice(0, -1) : prev);

  const addCol = () => {
    setRows((prev) => prev.map((row) => [...row, ""]));
    setAligns((prev) => [...prev, "left"]);
  };

  const removeCol = () => {
    if (cols <= 1) return;
    setRows((prev) => prev.map((row) => row.slice(0, -1)));
    setAligns((prev) => prev.slice(0, -1));
  };

  const toggleAlign = (c: number) =>
    setAligns((prev) => prev.map((a, idx) => idx === c ? ALIGN_CYCLE[a] : a));

  const markdown = useMemo(() => toMarkdown(rows, aligns), [rows, aligns]);

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 px-[14px] py-[9px] border border-line border-b-0 bg-bg-1">
        <button
          onClick={addRow}
          className="font-mono text-[11px] px-[8px] py-[3px] border border-line text-dim hover:text-brand hover:border-brand-mid transition-colors"
        >
          {TR[lang].addRow}
        </button>
        <button
          onClick={removeRow}
          disabled={rows.length <= 1}
          className="font-mono text-[11px] px-[8px] py-[3px] border border-line text-dim hover:text-danger hover:border-danger transition-colors disabled:opacity-30"
        >
          {TR[lang].rmRow}
        </button>
        <span className="w-px h-4 bg-line mx-1 shrink-0" />
        <button
          onClick={addCol}
          className="font-mono text-[11px] px-[8px] py-[3px] border border-line text-dim hover:text-brand hover:border-brand-mid transition-colors"
        >
          {TR[lang].addCol}
        </button>
        <button
          onClick={removeCol}
          disabled={cols <= 1}
          className="font-mono text-[11px] px-[8px] py-[3px] border border-line text-dim hover:text-danger hover:border-danger transition-colors disabled:opacity-30"
        >
          {TR[lang].rmCol}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => { trackRun(); copy(markdown); }}
          className="px-[18px] py-[6px] bg-brand text-bg font-mono text-[12px] font-semibold rounded-[3px] hover:brightness-110 transition-all"
        >
          {copied ? "✓" : i.copyAlt}
        </button>
      </div>

      <div className="border border-line overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12px]">
          <thead>
            <tr className="bg-bg-1">
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} className="border-r border-line border-b border-line last:border-r-0 p-0">
                  <div className="flex items-center">
                    <input
                      value={rows[0]?.[c] ?? ""}
                      onChange={(e) => setCell(0, c, e.target.value)}
                      className="flex-1 bg-transparent px-[10px] py-[10px] outline-none font-semibold text-fg min-w-[80px]"
                    />
                    <button
                      onClick={() => toggleAlign(c)}
                      className="px-2 py-[10px] font-normal text-dim hover:text-brand transition-colors border-l border-line shrink-0"
                    >
                      {ALIGN_ICON[aligns[c] ?? "left"]}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, r) => (
              <tr key={r} className="border-b border-line last:border-b-0 hover:bg-bg-2">
                {row.map((cell, c) => (
                  <td key={c} className="border-r border-line last:border-r-0 p-0">
                    <input
                      value={cell}
                      onChange={(e) => setCell(r + 1, c, e.target.value)}
                      className="w-full bg-transparent px-[10px] py-[9px] outline-none text-fg-1 min-w-[80px]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-line border-t-0">
        <div className="flex items-center justify-between px-[14px] py-[9px] bg-bg-1 border-b border-line">
          <span className="font-mono text-[11px] text-dim">// {TR[lang].output}</span>
          <button
            onClick={() => { trackRun(); copy(markdown); }}
            className="font-mono text-[11px] text-dim hover:text-brand transition-colors"
          >
            {copied ? "✓" : i.copy}
          </button>
        </div>
        <pre className="p-[14px] bg-bg-code font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre overflow-x-auto">
          {markdown}
        </pre>
      </div>
    </section>
  );
}
