"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { useTrackRun } from "@/hooks/useTrackRun";

type Dir = "csv→json" | "json→csv";

const QUOTED_FIELD_RE = /^"|"$/g;

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("Need at least a header row and one data row");
  const headers = (lines[0] ?? "").split(",").map((h) => h.trim().replace(QUOTED_FIELD_RE, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(QUOTED_FIELD_RE, ""));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])) as Record<string, string>;
  });
}

function jsonToCsv(text: string): string {
  const data = JSON.parse(text) as unknown[];
  if (!Array.isArray(data) || data.length === 0) throw new Error("Expected a non-empty JSON array");
  const first = data[0] as Record<string, unknown>;
  const keys = Object.keys(first);
  const header = keys.join(",");
  const rows = data.map((row) =>
    keys.map((k) => {
      const v = String((row as Record<string, unknown>)[k] ?? "");
      return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

const SAMPLE_CSV = `name,age,city\nAlice,30,Paris\nBob,25,London\nCharlie,35,Berlin`;
const SAMPLE_JSON = `[\n  { "name": "Alice", "age": 30, "city": "Paris" },\n  { "name": "Bob", "age": 25, "city": "London" }\n]`;

export function CsvJson() {
  const { lang } = useLang();
  const i = t(lang);
  const [dir, setDir] = useState<Dir>("csv→json");
  const [input, setInput] = useState(dir === "csv→json" ? SAMPLE_CSV : SAMPLE_JSON);
  const { copy } = useCopy();
  const trackRun = useTrackRun("csv-json", "text");

  const handleDirChange = (v: string) => {
    const d = v as Dir;
    setDir(d);
    setInput(d === "csv→json" ? SAMPLE_CSV : SAMPLE_JSON);
  };

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      if (dir === "csv→json") {
        return { output: JSON.stringify(parseCsv(input), null, 2), error: null };
      } else {
        return { output: jsonToCsv(input), error: null };
      }
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, dir]);

  const ext = dir === "csv→json" ? "json" : "csv";

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
            options={["csv→json", "json→csv"]}
            value={dir}
            onChange={(v) => handleDirChange(v)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={dir === "csv→json" ? "CSV" : "JSON"}
          ext={dir === "csv→json" ? "csv" : "json"}
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
          title={dir === "csv→json" ? "JSON" : "CSV"}
          ext={ext}
          actions={<PaneBtn onClick={() => output && copy(output)} disabled={!output}>{i.copy}</PaneBtn>}
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            {error ? (
              <p className="font-mono text-[12px] text-danger">✕ {error}</p>
            ) : (
              <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[320px]">
                {output || <span className="text-dim-2">{i.resultHere}</span>}
              </pre>
            )}
          </div>
        </Pane>
      </div>
    </section>
  );
}
