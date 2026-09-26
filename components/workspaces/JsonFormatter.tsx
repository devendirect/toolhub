"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { downloadBlob } from "@/lib/download";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl, Toggle } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { Editor } from "@/components/workspace/Editor";
import { useTrackRun } from "@/hooks/useTrackRun";
import { formatJson, type JsonHint } from "@/lib/json-format";

const SAMPLE = `{"user":{"id":42,"name":"Ada Lovelace","email":"ada@example.com","roles":["admin","engineer"],"meta":{"created_at":"2026-04-18T09:14:00Z","plan":"pro","seats":12}},"projects":[{"slug":"utilisio","status":"active"},{"slug":"engine","status":"archived"}]}`;

function countKeys(v: unknown): number {
  if (Array.isArray(v)) return v.reduce<number>((s, i) => s + countKeys(i), 0);
  if (v !== null && typeof v === "object") {
    const entries = Object.entries(v as Record<string, unknown>);
    return entries.length + entries.reduce<number>((s, [, val]) => s + countKeys(val), 0);
  }
  return 0;
}

const TR = {
  fr: {
    lineCol: (l: number, c: number) => `ligne ${l}, colonne ${c}`,
    lines:   (n: number) => `${n} lignes`,
    bigInts: (n: number) => `${n} grand(s) entier(s) conservé(s) au chiffre près (JSON.parse les aurait arrondis)`,
    dupKeys: (k: string) => `clé en double : « ${k} », seule la dernière valeur est gardée`,
    indentLabel: (v: number | "tab") => `indentation : ${v === "tab" ? "tabulation" : `${v} espaces`}`,
    sorted:  (on: boolean) => `clés triées : ${on ? "oui" : "non"}`,
    hints: {
      trailingComma:      "virgule en trop avant } ou ] (interdite en JSON)",
      singleQuote:        "apostrophes : le JSON exige des guillemets doubles \"",
      comment:            "commentaire : le JSON strict n'en accepte pas (tsconfig et VS Code, si)",
      unquotedKey:        "clé sans guillemets : écrivez \"cle\": valeur",
      expectedColon:      "deux-points attendus après la clé",
      expectedComma:      "virgule manquante entre deux éléments",
      unterminatedString: "chaîne jamais refermée : guillemet manquant",
      controlChar:        "retour à la ligne ou tabulation brute dans une chaîne : utilisez \\n ou \\t",
      badEscape:          "séquence d'échappement invalide après \\",
      badNumber:          "nombre mal formé",
      notJson:            "undefined, NaN et Infinity sont du JavaScript, pas du JSON",
      unexpectedEnd:      "fin du texte trop tôt : accolade, crochet ou guillemet manquant",
      trailingContent:    "texte en trop après la fin du JSON",
      unexpected:         "caractère inattendu",
    } satisfies Record<JsonHint, string>,
  },
  en: {
    lineCol: (l: number, c: number) => `line ${l}, column ${c}`,
    lines:   (n: number) => `${n} lines`,
    bigInts: (n: number) => `${n} large integer(s) kept digit for digit (JSON.parse would have rounded them)`,
    dupKeys: (k: string) => `duplicate key: "${k}", only the last value is kept`,
    indentLabel: (v: number | "tab") => `indent: ${v === "tab" ? "tab" : `${v} spaces`}`,
    sorted:  (on: boolean) => `sorted keys: ${on ? "yes" : "no"}`,
    hints: {
      trailingComma:      "extra comma before } or ] (not allowed in JSON)",
      singleQuote:        "single quotes: JSON requires double quotes \"",
      comment:            "comment: strict JSON doesn't allow them (tsconfig and VS Code do)",
      unquotedKey:        "key without quotes: write \"key\": value",
      expectedColon:      "colon expected after the key",
      expectedComma:      "missing comma between two items",
      unterminatedString: "string never closed: missing quote",
      controlChar:        "raw line break or tab inside a string: use \\n or \\t",
      badEscape:          "invalid escape sequence after \\",
      badNumber:          "malformed number",
      notJson:            "undefined, NaN and Infinity are JavaScript, not JSON",
      unexpectedEnd:      "text ends too early: missing brace, bracket or quote",
      trailingContent:    "extra text after the end of the JSON",
      unexpected:         "unexpected character",
    } satisfies Record<JsonHint, string>,
  },
};

export function JsonFormatter() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState<number | "tab">(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [minify, setMinify] = useState(false);

  const { output, error, parsed, inputBytes, outputBytes, bigIntCount, duplicateKeys } = useMemo(() => {
    const enc = new TextEncoder();
    const inB = enc.encode(input).length;
    const r = formatJson(input, { indent, sortKeys, minify });
    if (!r.ok) {
      const err = `${TR[lang].lineCol(r.error.line, r.error.col)} : ${TR[lang].hints[r.error.hint]}`;
      return { output: "", error: err, parsed: null, inputBytes: inB, outputBytes: 0, bigIntCount: 0, duplicateKeys: [] as string[] };
    }
    return { output: r.output, error: null, parsed: r.parsed, inputBytes: inB, outputBytes: enc.encode(r.output).length, bigIntCount: r.bigIntCount, duplicateKeys: r.duplicateKeys };
  }, [input, indent, sortKeys, minify, lang]);

  const handlePasteSample = () => setInput(SAMPLE);
  const handleClear = () => setInput("");
  const { copy } = useCopy();
  const trackRun = useTrackRun("json-formatter", "text");
  const handleCopy = () => { if (output) { trackRun(); copy(output); } };
  const handleDownload = () => {
    if (!output) return;
    downloadBlob(new Blob([output], { type: "application/json" }), "formatted.json");
  };

  const outputLines = output ? output.split("\n").length : 0;
  const outputKeys  = parsed ? countKeys(parsed) : 0;

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
            onClick={() => setInput((v) => { const r = formatJson(v, { indent, sortKeys: false, minify: false }); return r.ok ? r.output : v; })}
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
          meta={`${inputBytes} ${i.bytes}`}
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
                <span>{TR[lang].lines(input.split("\n").length)}</span>
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
          meta={output ? `${outputBytes} ${i.bytes} · ${outputLines} ${i.lines} · ${outputKeys} ${i.keys}` : undefined}
          actions={
            <>
              <PaneBtn onClick={handleCopy}>{i.copy}</PaneBtn>
              <PaneBtn onClick={handleDownload}>{i.download}</PaneBtn>
            </>
          }
          footer={
            output ? (
              <>
                <span>{TR[lang].indentLabel(indent)}</span>
                <span>{TR[lang].sorted(sortKeys)}</span>
                <span>{i.generated} ✓</span>
              </>
            ) : undefined
          }
        >
          {(bigIntCount > 0 || duplicateKeys.length > 0) && (
            <ul className="px-[14px] py-2 flex flex-col gap-1 border-b border-line bg-bg-1">
              {bigIntCount > 0 && <li className="font-mono text-[11.5px] text-brand">✓ {TR[lang].bigInts(bigIntCount)}</li>}
              {duplicateKeys.map((k) => (
                <li key={k} className="font-mono text-[11.5px] text-hot">⚠ {TR[lang].dupKeys(k)}</li>
              ))}
            </ul>
          )}
          <Editor value={output} readOnly />
        </Pane>
      </div>
    </section>
  );
}
