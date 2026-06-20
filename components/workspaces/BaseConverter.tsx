"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { CopyableRow } from "@/components/workspace/CopyableRow";
import { useTrackRun } from "@/hooks/useTrackRun";

type Base = 2 | 8 | 10 | 16;

const BASES: { base: Base; label: string; prefix: string }[] = [
  { base: 2,  label: "BIN",  prefix: "0b" },
  { base: 8,  label: "OCT",  prefix: "0o" },
  { base: 10, label: "DEC",  prefix: ""   },
  { base: 16, label: "HEX",  prefix: "0x" },
];

const TR = {
  fr: {
    fromBase:     "base source",
    invalidBase:  "valeur invalide pour la base sélectionnée",
    decimalValue: "valeur décimale",
    clickToCopy:  "cliquer pour copier",
  },
  en: {
    fromBase:     "from base",
    invalidBase:  "invalid value for selected base",
    decimalValue: "decimal value",
    clickToCopy:  "click to copy",
  },
} as const;

export function BaseConverter() {
  const { lang } = useLang();
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState<Base>(10);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("base-converter", "dev");

  const decimal = useMemo(() => {
    const n = parseInt(input.trim(), fromBase);
    return isNaN(n) ? null : n;
  }, [input, fromBase]);

  const results = useMemo(() => {
    if (decimal === null) return null;
    return BASES.map(({ base, label, prefix }) => ({
      label,
      prefix,
      value: decimal.toString(base).toUpperCase(),
      base,
    }));
  }, [decimal]);

  return (
    <section className="mb-10">
      <OptionsBar>
        <OptBlock label={TR[lang].fromBase}>
          <SegControl
            options={[2, 8, 10, 16]}
            value={fromBase}
            onChange={(v) => setFromBase(v as Base)}
          />
        </OptBlock>
        <span className="font-mono text-[11px] text-dim">
          {BASES.find((b) => b.base === fromBase)?.label}
        </span>
      </OptionsBar>

      <div className="border border-line border-b-0">
        <div className="flex items-center gap-0">
          <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">
            base {fromBase}
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={fromBase === 16 ? "FF or ff…" : fromBase === 2 ? "11111111…" : "255…"}
            className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="border border-line divide-y divide-line">
        {results ? results.map(({ label, prefix, value, base }) => (
          <CopyableRow
            key={base}
            id={label}
            label={label}
            value={value}
            copied={copied}
            onClick={() => { trackRun(); copy(value, label); }}
            lang={lang}
            labelClass="w-12"
            valueClass="text-[14px] text-fg"
            extra={prefix ? <span className="font-mono text-[11px] text-dim-2 shrink-0">{prefix}</span> : undefined}
          />
        )) : (
          <div className="px-[14px] py-[14px]">
            <span className="font-mono text-[12px] text-dim-2">
              {TR[lang].invalidBase}
            </span>
          </div>
        )}

        {results && (
          <div className="flex items-center gap-4 px-[14px] py-2 bg-bg font-mono text-[11px] text-dim">
            <span>{TR[lang].decimalValue}: {decimal}</span>
            <span className="ml-auto">{TR[lang].clickToCopy}</span>
          </div>
        )}
      </div>
    </section>
  );
}
