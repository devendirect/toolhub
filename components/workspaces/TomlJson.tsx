"use client";

import { useState, useMemo } from "react";
import { parse, stringify } from "smol-toml";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { useTrackRun } from "@/hooks/useTrackRun";

type Dir = "toml→json" | "json→toml";

/** Pertes que la conversion ferait sans rien dire : on les signale. */
export type ConvWarning =
  | { kind: "nullDropped"; path: string }     // JSON → TOML : TOML n'a pas de null
  | { kind: "nonFinite"; path: string };      // TOML → JSON : inf / nan deviennent null

export type ConvResult =
  | { output: string; warnings: ConvWarning[]; error: null }
  | { output: ""; warnings: []; error: { code: "topLevelNotObject" | "nullInArray" } | { code: "parse"; message: string } };

function walk(v: unknown, path: string, visit: (v: unknown, path: string, inArray: boolean) => void, inArray = false) {
  visit(v, path, inArray);
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, visit, true));
  else if (v && typeof v === "object" && !(v instanceof Date))
    for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k, visit);
}

export function convertTomlJson(input: string, dir: Dir): ConvResult {
  try {
    if (dir === "toml→json") {
      const data = parse(input);
      const warnings: ConvWarning[] = [];
      walk(data, "", (v, path) => {
        if (typeof v === "number" && !Number.isFinite(v)) warnings.push({ kind: "nonFinite", path });
      });
      return { output: JSON.stringify(data, null, 2), warnings, error: null };
    }
    const data: unknown = JSON.parse(input);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { output: "", warnings: [], error: { code: "topLevelNotObject" } };
    }
    const warnings: ConvWarning[] = [];
    let nullInArray = false;
    walk(data, "", (v, path, inArray) => {
      if (v !== null) return;
      if (inArray) nullInArray = true;
      else warnings.push({ kind: "nullDropped", path });
    });
    if (nullInArray) return { output: "", warnings: [], error: { code: "nullInArray" } };
    return { output: stringify(data as Record<string, unknown>), warnings, error: null };
  } catch (e) {
    return { output: "", warnings: [], error: { code: "parse", message: (e as Error).message } };
  }
}

const TR = {
  fr: {
    nullDropped:       (p: string) => `« ${p} » vaut null : TOML n'a pas de null, la clé est omise.`,
    nonFinite:         (p: string) => `« ${p} » vaut inf ou nan : JSON ne sait pas l'écrire, la valeur devient null.`,
    topLevelNotObject: "Le JSON doit être un objet { … } : un fichier TOML ne peut pas commencer par un tableau ou une valeur simple.",
    nullInArray:       "Un tableau contient null : TOML n'a pas de null. Retirez-le ou remplacez-le avant de convertir.",
  },
  en: {
    nullDropped:       (p: string) => `"${p}" is null: TOML has no null, so the key is left out.`,
    nonFinite:         (p: string) => `"${p}" is inf or nan: JSON can't represent it, so it becomes null.`,
    topLevelNotObject: "The JSON must be an object { … }: a TOML file can't start with an array or a plain value.",
    nullInArray:       "An array contains null: TOML has no null. Remove or replace it before converting.",
  },
};

const SAMPLE_TOML = `[package]
name = "my-project"
version = "1.0.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }

[profile.release]
opt-level = 3
lto = true`;

const SAMPLE_JSON = `{
  "package": {
    "name": "my-project",
    "version": "1.0.0",
    "edition": "2021"
  },
  "dependencies": {
    "serde": { "version": "1.0", "features": ["derive"] },
    "tokio": { "version": "1", "features": ["full"] }
  }
}`;

export function TomlJson() {
  const { lang } = useLang();
  const i = t(lang);
  const [dir, setDir] = useState<Dir>("toml→json");
  const [input, setInput] = useState(SAMPLE_TOML);
  const { copy } = useCopy();
  const trackRun = useTrackRun("toml-json", "dev");

  const handleDirChange = (v: string) => {
    const d = v as Dir;
    setDir(d);
    setInput(d === "toml→json" ? SAMPLE_TOML : SAMPLE_JSON);
  };

  const { output, warnings, error } = useMemo<ConvResult>(
    () => (input.trim() ? convertTomlJson(input, dir) : { output: "", warnings: [], error: null }),
    [input, dir]
  );
  const errorText = !error ? null
    : error.code === "parse" ? error.message
    : TR[lang][error.code];

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => { if (output) { trackRun(); copy(output); } }}
            disabled={!output}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40"
          >
            {i.copyAlt}
          </button>
        }
      >
        <OptBlock label="direction">
          <SegControl
            options={["toml→json", "json→toml"]}
            value={dir}
            onChange={handleDirChange}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={dir === "toml→json" ? "TOML" : "JSON"}
          ext={dir === "toml→json" ? "toml" : "json"}
          actions={<PaneBtn onClick={() => setInput("")}>{i.clearInput}</PaneBtn>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full min-h-[360px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={dir === "toml→json" ? "JSON" : "TOML"}
          ext={dir === "toml→json" ? "json" : "toml"}
          actions={
            <PaneBtn onClick={() => output && copy(output)} disabled={!output}>
              {i.copy}
            </PaneBtn>
          }
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            {errorText ? (
              <p className="font-mono text-[12px] text-danger whitespace-pre-wrap">✕ {errorText}</p>
            ) : (
              <>
              {warnings.length > 0 && (
                <ul className="mb-3 flex flex-col gap-1">
                  {warnings.map((w) => (
                    <li key={w.kind + w.path} className="font-mono text-[11.5px] text-hot">⚠ {TR[lang][w.kind](w.path)}</li>
                  ))}
                </ul>
              )}
              <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[360px]">
                {output || <span className="text-dim-2">{i.resultHere}</span>}
              </pre>
              </>
            )}
          </div>
        </Pane>
      </div>
    </section>
  );
}
