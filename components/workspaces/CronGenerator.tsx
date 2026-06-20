"use client";

import { useState, useEffect } from "react";
import { useCopy } from "@/hooks/useCopy";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";

const TR = {
  fr: {
    fieldsRequired: "5 champs requis",
    presets:        "raccourcis",
    exprLabel:      "// expression",
    descLabel:      "// traduction",
    loadingDesc:    "chargement de la description…",
    fieldMinute:    "minute",
    fieldHour:      "heure",
    fieldDom:       "jour/mois",
    fieldMonth:     "mois",
    fieldDow:       "jour/semaine",
    symAny:         "toute valeur",
    symList:        "liste : 1,3,5",
    symRange:       "plage : 1-5",
    symStep:        "pas : */5",
    symLast:        "dernier (dom/dow)",
  },
  en: {
    fieldsRequired: "5 fields required",
    presets:        "presets",
    exprLabel:      "// cron",
    descLabel:      "// description",
    loadingDesc:    "loading description…",
    fieldMinute:    "minute",
    fieldHour:      "hour",
    fieldDom:       "day/month",
    fieldMonth:     "month",
    fieldDow:       "day/week",
    symAny:         "any value",
    symList:        "list: 1,3,5",
    symRange:       "range: 1-5",
    symStep:        "step: */5",
    symLast:        "last (dom/dow)",
  },
} as const;

interface CronField { value: string; label: string; placeholder: string; hint: string; }

const PRESETS = [
  { label: "every minute",   expr: "* * * * *" },
  { label: "every hour",     expr: "0 * * * *" },
  { label: "daily 9am",      expr: "0 9 * * *" },
  { label: "weekdays 9am",   expr: "0 9 * * 1-5" },
  { label: "weekly Mon",     expr: "0 9 * * 1" },
  { label: "monthly 1st",    expr: "0 9 1 * *" },
  { label: "yearly Jan 1",   expr: "0 9 1 1 *" },
];

const FIELD_PRESETS: Record<string, string[]> = {
  min:  ["*", "0", "*/5", "*/15", "*/30"],
  hour: ["*", "0", "6", "9", "12", "18", "*/2", "*/6"],
  dom:  ["*", "1", "15", "L"],
  mon:  ["*", "1", "3", "6", "9", "12", "1-6"],
  dow:  ["*", "0", "1", "1-5", "0,6", "MON", "FRI"],
};

function validate(expr: string, lang: "fr" | "en"): string | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return TR[lang].fieldsRequired;
  return null;
}

function parsePreset(expr: string): Record<string, string> {
  const [min = "*", hour = "*", dom = "*", mon = "*", dow = "*"] = expr.split(" ");
  return { min, hour, dom, mon, dow };
}

export function CronGenerator() {
  const { lang } = useLang();
  const i = t(lang);

  const [fields, setFields] = useState({ min: "0", hour: "9", dom: "*", mon: "*", dow: "*" });
  const { copy, copied } = useCopy();
  const [description, setDescription] = useState<string>("");

  const expr = `${fields.min} ${fields.hour} ${fields.dom} ${fields.mon} ${fields.dow}`;
  const validationError = validate(expr, lang);

  useEffect(() => {
    if (validationError) { setDescription(""); return; }
    let cancelled = false;
    (async () => {
      try {
        const { default: cronstrue } = await import("cronstrue");
        if (lang === "fr") await import("cronstrue/locales/fr");
        if (cancelled) return;
        const opts = lang === "fr"
          ? { locale: "fr", use24HourTimeFormat: true }
          : { use24HourTimeFormat: false };
        setDescription(cronstrue.toString(expr, opts));
      } catch {
        if (!cancelled) {
          try {
            const { default: cronstrue } = await import("cronstrue");
            if (!cancelled) setDescription(cronstrue.toString(expr));
          } catch {
            if (!cancelled) setDescription("");
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [expr, lang, validationError]);

  const setField = (key: string, value: string) => setFields((p) => ({ ...p, [key]: value }));

  const loadPreset = (e: string) => setFields(parsePreset(e) as typeof fields);

  const FIELD_DATA: Array<CronField & { key: string }> = [
    { key: "min",  value: fields.min,  label: TR[lang].fieldMinute, placeholder: "0-59", hint: "0–59, */5, 1-30" },
    { key: "hour", value: fields.hour, label: TR[lang].fieldHour,   placeholder: "0-23", hint: "0–23, */2, 9-17" },
    { key: "dom",  value: fields.dom,  label: TR[lang].fieldDom,    placeholder: "1-31", hint: "1–31, L, */2" },
    { key: "mon",  value: fields.mon,  label: TR[lang].fieldMonth,  placeholder: "1-12", hint: "1–12, JAN-DEC" },
    { key: "dow",  value: fields.dow,  label: TR[lang].fieldDow,    placeholder: "0-7",  hint: "0–7, MON-SUN, 1-5" },
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-center gap-2 px-[14px] py-[12px] border border-line border-b-0 bg-bg-1">
        <span className="font-mono text-[10px] text-dim-2 uppercase tracking-[0.1em] mr-1 shrink-0">
          {TR[lang].presets}
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.expr}
            onClick={() => loadPreset(p.expr)}
            className={`font-mono text-[11px] px-[8px] py-[3px] border transition-colors ${
              expr === p.expr ? "border-brand text-brand bg-brand-soft" : "border-line text-dim hover:border-line-2 hover:text-fg-1"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="border border-line">
        <div className="grid grid-cols-5 border-b border-line">
          {FIELD_DATA.map(({ key, ...f }) => (
            <div key={f.label} className={`flex flex-col border-r border-line last:border-r-0`}>
              <div className="px-[10px] py-[8px] border-b border-line bg-bg">
                <span className="font-mono text-[10px] text-dim uppercase tracking-[0.1em]">{f.label}</span>
              </div>
              <div className="p-[10px] bg-bg-1 flex-1 flex flex-col gap-2">
                <input
                  value={f.value}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-bg border border-line px-2 py-[6px] font-mono text-[14px] text-brand outline-none focus:border-brand-mid text-center"
                  spellCheck={false}
                />
                <div className="flex flex-wrap gap-1">
                  {(FIELD_PRESETS[key] ?? []).map((v) => (
                    <button
                      key={v}
                      onClick={() => setField(key, v)}
                      className={`font-mono text-[10px] px-[5px] py-[1px] border transition-colors ${
                        f.value === v ? "border-brand text-brand" : "border-line text-dim-2 hover:text-fg-1 hover:border-line-2"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-dim-2">{f.hint}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 px-[14px] py-[14px] border-b border-line bg-bg-code">
          <span className="font-mono text-[11px] text-dim shrink-0">{TR[lang].exprLabel}</span>
          <code className="font-mono text-[18px] text-brand tracking-[0.12em] flex-1">{expr}</code>
          <button
            onClick={() => copy(expr)}
            className="px-[18px] py-[7px] bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all shrink-0"
          >
            {copied ? "✓" : i.copy}
          </button>
        </div>

        <div className="px-[14px] py-[14px] bg-bg-1">
          {validationError ? (
            <span className="font-mono text-[12px] text-danger">✕ {validationError}</span>
          ) : description ? (
            <div className="flex flex-col gap-[6px]">
              <span className="font-mono text-[11px] text-dim">{TR[lang].descLabel}</span>
              <span className="text-[15px] text-fg font-medium">{description}</span>
            </div>
          ) : (
            <span className="font-mono text-[12px] text-dim-2">
              {TR[lang].loadingDesc}
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 border-t border-line">
          {[
            ["min", "0–59"],
            ["hour", "0–23"],
            ["dom", "1–31, L"],
            ["month", "1–12"],
            ["dow", "0–7, L"],
          ].map(([label, range]) => (
            <div key={label} className="px-[10px] py-[8px] border-r border-line last:border-r-0 bg-bg">
              <div className="font-mono text-[10px] text-dim">{label}</div>
              <div className="font-mono text-[10px] text-dim-2">{range}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 mt-3 px-1">
        {[
          ["*",   TR[lang].symAny],
          [",",   TR[lang].symList],
          ["-",   TR[lang].symRange],
          ["*/n", TR[lang].symStep],
          ["L",   TR[lang].symLast],
        ].map(([sym, desc]) => (
          <span key={sym} className="font-mono text-[11px] text-dim">
            <span className="text-brand">{sym}</span> — {desc}
          </span>
        ))}
      </div>
    </section>
  );
}
