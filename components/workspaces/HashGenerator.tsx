"use client";

import { useState, useEffect, useRef } from "react";
import { DropZone } from "@/components/workspace/DropZone";
import { useCopy } from "@/hooks/useCopy";
import { useLang } from "@/components/providers/I18nProvider";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";

type InputMode = "text" | "file";

interface HashResult { algo: string; value: string; }

async function hashBuffer(buf: ArrayBuffer): Promise<HashResult[]> {
  const algos: [string, string][] = [
    ["MD5",     ""],
    ["SHA-1",   "SHA-1"],
    ["SHA-256", "SHA-256"],
    ["SHA-512", "SHA-512"],
  ];

  const SparkMD5 = (await import("spark-md5")).default;
  const md5 = SparkMD5.ArrayBuffer.hash(buf);

  const shaResults = await Promise.all(
    algos.slice(1).map(async ([label, algo]) => {
      const hash = await crypto.subtle.digest(algo, buf);
      return { algo: label, value: Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("") };
    })
  );

  return [{ algo: "MD5", value: md5 }, ...shaResults];
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function HashGenerator() {
  const { lang } = useLang();
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("Hello, toolhub!");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [computing, setComputing] = useState(false);
  const { copy, copied } = useCopy();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mode !== "text") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setComputing(true);
      const buf = new TextEncoder().encode(text).buffer as ArrayBuffer;
      setHashes(await hashBuffer(buf));
      setComputing(false);
    }, 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [text, mode]);

  const handleFile = async (f: File) => {
    setFile(f);
    setComputing(true);
    const buf = await f.arrayBuffer();
    setHashes(await hashBuffer(buf));
    setComputing(false);
  };

  const handleCopy = (value: string) => copy(value);

  return (
    <section className="mb-10">
      <OptionsBar
      >
        <OptBlock label={lang === "fr" ? "source" : "source"}>
          <SegControl
            options={["text", "file"] as InputMode[]}
            value={mode}
            onChange={(v) => { setMode(v as InputMode); setHashes([]); setFile(null); }}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        {/* Input area */}
        <div className="border-b border-line bg-bg-code">
          {mode === "text" ? (
            <div className="p-[14px]">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={lang === "fr" ? "texte à hacher…" : "text to hash…"}
                className="w-full min-h-[120px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
                spellCheck={false}
              />
            </div>
          ) : (
            <DropZone
              onFile={handleFile}
              glyph="#"
              label={lang === "fr" ? "glisser un fichier ou cliquer" : "drag a file or click"}
              current={file ? `${file.name} (${formatBytes(file.size)})` : null}
              className="border-0 min-h-[120px]"
            />
          )}
        </div>

        {/* Hash results */}
        <div className="divide-y divide-line">
          {computing && (
            <div className="flex items-center justify-center py-8 font-mono text-[12px] text-dim">
              {lang === "fr" ? "calcul en cours…" : "computing…"}
            </div>
          )}
          {!computing && hashes.map(({ algo, value }) => (
            <div
              key={algo}
              className="group flex items-center gap-4 px-[14px] py-[12px] hover:bg-bg-2 transition-colors cursor-pointer"
              onClick={() => handleCopy(value)}
            >
              <span className="font-mono text-[11px] text-dim uppercase tracking-[0.08em] w-16 shrink-0">{algo}</span>
              <span className="font-mono text-[12px] text-fg-1 flex-1 break-all">{value}</span>
              <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {copied === value ? "✓" : (lang === "fr" ? "copier" : "copy")}
              </span>
            </div>
          ))}
          {!computing && hashes.length === 0 && (
            <div className="flex items-center justify-center py-8 font-mono text-[12px] text-dim-2">
              {"// "}{lang === "fr" ? "les hashes apparaîtront ici" : "hashes will appear here"}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span>MD5 · SHA-1 · SHA-256 · SHA-512</span>
          <span>{lang === "fr" ? "cliquer pour copier" : "click to copy"}</span>
        </div>
      </div>
    </section>
  );
}
