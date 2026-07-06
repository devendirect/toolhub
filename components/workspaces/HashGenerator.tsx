"use client";

import { useState, useEffect, useRef } from "react";
import { DropZone } from "@/components/workspace/DropZone";
import { useCopy } from "@/hooks/useCopy";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { CopyableRow } from "@/components/workspace/CopyableRow";
import { fmtSize } from "@/lib/format";
import { useTrackRun } from "@/hooks/useTrackRun";

type InputMode = "text" | "file";

interface HashResult { algo: string; value: string; }

const TR = {
  fr: {
    hashPlaceholder: "texte à hacher…",
    hashesHere:      "les hashes apparaîtront ici",
    dragOrClick:     "glisser un fichier ou cliquer",
    clickToCopy:     "cliquer pour copier",
  },
  en: {
    hashPlaceholder: "text to hash…",
    hashesHere:      "hashes will appear here",
    dragOrClick:     "drag a file or click",
    clickToCopy:     "click to copy",
  },
} as const;

export async function hashBuffer(buf: ArrayBuffer): Promise<HashResult[]> {
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

export function HashGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("Hello, utilisio!");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [computing, setComputing] = useState(false);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("hash-generator", "dev");
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

  return (
    <section className="mb-10">
      <OptionsBar>
        <OptBlock label="source">
          <SegControl
            options={["text", "file"] as InputMode[]}
            value={mode}
            onChange={(v) => { setMode(v as InputMode); setHashes([]); setFile(null); }}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        <div className="border-b border-line bg-bg-code">
          {mode === "text" ? (
            <div className="p-[14px]">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={TR[lang].hashPlaceholder}
                className="w-full min-h-[120px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
                spellCheck={false}
              />
            </div>
          ) : (
            <DropZone
              onFile={handleFile}
              glyph="#"
              label={TR[lang].dragOrClick}
              current={file ? `${file.name} (${fmtSize(file.size)})` : null}
              className="border-0 min-h-[120px]"
            />
          )}
        </div>

        <div className="divide-y divide-line">
          {computing && (
            <div className="flex items-center justify-center py-8 font-mono text-[12px] text-dim">
              {i.computing}
            </div>
          )}
          {!computing && hashes.map(({ algo, value }) => (
            <CopyableRow
              key={algo}
              id={value}
              label={algo}
              value={value}
              copied={copied}
              onClick={() => { trackRun(); copy(value); }}
              lang={lang}
              valueClass="text-[12px] text-fg-1"
            />
          ))}
          {!computing && hashes.length === 0 && (
            <div className="flex items-center justify-center py-8 font-mono text-[12px] text-dim-2">
              {"// "}{TR[lang].hashesHere}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span>MD5 · SHA-1 · SHA-256 · SHA-512</span>
          <span>{TR[lang].clickToCopy}</span>
        </div>
      </div>
    </section>
  );
}
