"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { t } from "@/lib/i18n";

const TR = {
  fr: { link: "lier" },
  en: { link: "link" },
} as const;

type Unit = "px" | "%";
type Corner = "tl" | "tr" | "br" | "bl";
const CORNERS: { key: Corner; label: string }[] = [
  { key: "tl", label: "top-left" },
  { key: "tr", label: "top-right" },
  { key: "br", label: "bottom-right" },
  { key: "bl", label: "bottom-left" },
];

export function BorderRadius() {
  const { lang } = useLang();
  const i = t(lang);
  const [unit, setUnit] = useState<Unit>("px");
  const [linked, setLinked] = useState(true);
  const [values, setValues] = useState<Record<Corner, number>>({ tl: 12, tr: 12, br: 12, bl: 12 });
  const { copy, copied } = useCopy();

  const update = (key: Corner, v: number) => {
    if (linked) setValues({ tl: v, tr: v, br: v, bl: v });
    else setValues((prev) => ({ ...prev, [key]: v }));
  };

  const max = unit === "%" ? 50 : 200;

  const css = useMemo(() => {
    const { tl, tr, br, bl } = values;
    const u = unit;
    if (tl === tr && tr === br && br === bl) return `${tl}${u}`;
    return `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}`;
  }, [values, unit]);

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => copy(`border-radius: ${css};`)}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {copied ? "✓" : "copy CSS ⏎"}
          </button>
        }
      >
        <OptBlock label={i.unitOpt}>
          <SegControl options={["px", "%"]} value={unit} onChange={(v) => setUnit(v as Unit)} />
        </OptBlock>
        <OptBlock label={TR[lang].link}>
          <SegControl
            options={["on", "off"]}
            value={linked ? "on" : "off"}
            onChange={(v) => setLinked(v === "on")}
          />
        </OptBlock>
      </OptionsBar>

      {/* Preview */}
      <div className="h-[200px] border-x border-line bg-bg-1 flex items-center justify-center">
        <div
          className="w-40 h-40 bg-brand opacity-80"
          style={{ borderRadius: css }}
        />
      </div>

      {/* Controls */}
      <div className="border border-line border-t-0 bg-bg-1">
        {CORNERS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3 px-[14px] py-[10px] border-b border-line">
            <span className="font-mono text-[11px] text-dim w-28 shrink-0">{label}</span>
            <input
              type="range" min={0} max={max} value={values[key]}
              onChange={(e) => update(key, Number(e.target.value))}
              className="flex-1 accent-[var(--brand)]"
            />
            <input
              type="number" min={0} max={max} value={values[key]}
              onChange={(e) => update(key, Number(e.target.value))}
              className="w-[52px] font-mono text-[12px] bg-bg border border-line px-2 py-[3px] text-fg outline-none focus:border-brand-mid"
            />
            <span className="font-mono text-[11px] text-dim w-4">{unit}</span>
          </div>
        ))}

        <div className="bg-bg-code px-[14px] py-[12px] cursor-pointer" onClick={() => copy(`border-radius: ${css};`)}>
          <pre className="font-mono text-[12px] text-fg-1 leading-[1.6]">
            <span className="text-dim">border-radius: </span>
            <span className="text-brand">{css}</span>
            <span className="text-dim">;</span>
          </pre>
        </div>
      </div>
    </section>
  );
}
