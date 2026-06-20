"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";

const TR = {
  fr: {
    colUnit:  "unité col",
    columns:  "colonnes",
    rowsLabel: "lignes",
  },
  en: {
    colUnit:  "col unit",
    columns:  "columns",
    rowsLabel: "rows",
  },
} as const;

type Unit = "fr" | "px" | "%";

function buildTrack(count: number, size: string): string {
  return `repeat(${count}, ${size})`;
}

export function CssGrid() {
  const { lang } = useLang();
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [colSize, setColSize] = useState("1fr");
  const [rowSize, setRowSize] = useState("120px");
  const [gap, setGap] = useState(16);
  const [unit, setUnit] = useState<Unit>("fr");
  const { copy, copied } = useCopy();

  const css = useMemo(() => {
    const colTrack = buildTrack(cols, colSize);
    const rowTrack = buildTrack(rows, rowSize);
    return `display: grid;\ngrid-template-columns: ${colTrack};\ngrid-template-rows: ${rowTrack};\ngap: ${gap}px;`;
  }, [cols, rows, colSize, rowSize, gap]);

  const colOptions: Record<Unit, string[]> = {
    fr:  ["1fr", "2fr", "3fr"],
    px:  ["100px", "150px", "200px"],
    "%": ["25%", "33%", "50%"],
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => copy(css)}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {copied ? "✓" : "copy CSS ⏎"}
          </button>
        }
      >
        <OptBlock label={TR[lang].colUnit}>
          <SegControl
            options={["fr", "px", "%"]}
            value={unit}
            onChange={(v) => {
              const u = v as Unit;
              setUnit(u);
              setColSize(colOptions[u][0] ?? "1fr");
            }}
          />
        </OptBlock>
      </OptionsBar>

      {/* Controls */}
      <div className="border border-line border-b-0 bg-bg-1">
        {[
          {
            label: TR[lang].columns,
            value: cols,
            min: 1, max: 12,
            onChange: (v: number) => setCols(v),
          },
          {
            label: TR[lang].rowsLabel,
            value: rows,
            min: 1, max: 8,
            onChange: (v: number) => setRows(v),
          },
          {
            label: "gap",
            value: gap,
            min: 0, max: 64,
            onChange: (v: number) => setGap(v),
          },
        ].map(({ label, value, min, max, onChange }) => (
          <div key={label} className="flex items-center gap-3 px-[14px] py-[10px] border-b border-line">
            <span className="font-mono text-[11px] text-dim w-20 shrink-0">{label}</span>
            <input
              type="range" min={min} max={max} value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 accent-[var(--brand)]"
            />
            <input
              type="number" min={min} max={max} value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-[52px] font-mono text-[12px] bg-bg border border-line px-2 py-[3px] text-fg outline-none focus:border-brand-mid"
            />
          </div>
        ))}

        <div className="flex items-center gap-3 px-[14px] py-[10px] border-b border-line">
          <span className="font-mono text-[11px] text-dim w-20 shrink-0">col size</span>
          <SegControl
            options={colOptions[unit]}
            value={colSize}
            onChange={(v) => setColSize(v)}
          />
        </div>

        <div className="flex items-center gap-3 px-[14px] py-[10px] border-b border-line">
          <span className="font-mono text-[11px] text-dim w-20 shrink-0">row size</span>
          <SegControl
            options={["80px", "120px", "160px", "200px"]}
            value={rowSize}
            onChange={(v) => setRowSize(v)}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="border border-line border-b-0 p-4 bg-bg-1 overflow-auto">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: buildTrack(cols, colSize),
            gridTemplateRows: buildTrack(rows, rowSize),
            gap: `${gap}px`,
            minWidth: 0,
          }}
        >
          {Array.from({ length: cols * rows }, (_, i) => (
            <div
              key={i}
              className="bg-brand/20 border border-brand/40 flex items-center justify-center"
            >
              <span className="font-mono text-[11px] text-dim">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div
        className="border border-line bg-bg-code px-[14px] py-[12px] cursor-pointer"
        onClick={() => copy(css)}
      >
        <pre className="font-mono text-[12px] text-fg-1 leading-[1.6]">
          {css.split("\n").map((line, i) => {
            const [prop, ...rest] = line.split(":");
            return (
              <div key={i}>
                <span className="text-dim">{prop}:</span>
                <span className="text-brand">{rest.join(":")}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </section>
  );
}
