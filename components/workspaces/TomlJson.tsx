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

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      if (dir === "toml→json") {
        return { output: JSON.stringify(parse(input), null, 2), error: null };
      } else {
        return { output: stringify(JSON.parse(input) as Record<string, unknown>), error: null };
      }
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, dir]);

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
            {error ? (
              <p className="font-mono text-[12px] text-danger">✕ {error}</p>
            ) : (
              <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[360px]">
                {output || <span className="text-dim-2">{i.resultHere}</span>}
              </pre>
            )}
          </div>
        </Pane>
      </div>
    </section>
  );
}
