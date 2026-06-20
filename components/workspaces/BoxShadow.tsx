"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { t } from "@/lib/i18n";
import { useTrackRun } from "@/hooks/useTrackRun";

interface Slider { label: string; min: number; max: number; value: number; onChange: (v: number) => void; }

function Slider({ label, min, max, value, onChange }: Slider) {
  return (
    <div className="flex items-center gap-3 px-[14px] py-[10px] border-b border-line">
      <span className="font-mono text-[11px] text-dim w-16 shrink-0">{label}</span>
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
      <span className="font-mono text-[11px] text-dim w-4">px</span>
    </div>
  );
}

export function BoxShadow() {
  const { lang } = useLang();
  const i = t(lang);
  const [x, setX] = useState(4);
  const [y, setY] = useState(8);
  const [blur, setBlur] = useState(16);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [alpha, setAlpha] = useState(25);
  const [inset, setInset] = useState(false);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("box-shadow", "design");

  const rgba = useMemo(() => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
  }, [color, alpha]);

  const css = useMemo(
    () => `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}`,
    [x, y, blur, spread, rgba, inset]
  );

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => { trackRun(); copy(`box-shadow: ${css};`); }}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {copied ? "✓" : "copy CSS ⏎"}
          </button>
        }
      >
        <OptBlock label="inset">
          <SegControl
            options={["off", "on"]}
            value={inset ? "on" : "off"}
            onChange={(v) => setInset(v === "on")}
          />
        </OptBlock>
      </OptionsBar>

      {/* Preview */}
      <div className="h-[180px] border-x border-line bg-bg-1 flex items-center justify-center">
        <div
          className="w-32 h-32 bg-bg"
          style={{ boxShadow: css }}
        />
      </div>

      {/* Controls */}
      <div className="border border-line border-t-0 bg-bg-1">
        <Slider label="x"      min={-100} max={100} value={x}      onChange={setX} />
        <Slider label="y"      min={-100} max={100} value={y}      onChange={setY} />
        <Slider label="blur"   min={0}    max={100} value={blur}   onChange={setBlur} />
        <Slider label="spread" min={-50}  max={50}  value={spread} onChange={setSpread} />
        <Slider label="alpha"  min={0}    max={100} value={alpha}  onChange={setAlpha} />

        <div className="flex items-center gap-3 px-[14px] py-[10px] border-b border-line">
          <span className="font-mono text-[11px] text-dim w-16 shrink-0">{i.color}</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-line bg-transparent" />
          <span className="font-mono text-[12px] text-fg">{color.toUpperCase()} · {alpha}%</span>
        </div>

        {/* CSS output */}
        <div className="bg-bg-code px-[14px] py-[12px] cursor-pointer" onClick={() => copy(`box-shadow: ${css};`)}>
          <pre className="font-mono text-[12px] text-fg-1 leading-[1.6]">
            <span className="text-dim">box-shadow: </span>
            <span className="text-brand">{css}</span>
            <span className="text-dim">;</span>
          </pre>
        </div>
      </div>
    </section>
  );
}
