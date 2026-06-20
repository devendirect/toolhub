"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: {
    words:      "mots",
    sentences:  "phrases",
    paragraphs: "paragraphes",
    count:      "quantité",
  },
  en: {
    words:      "words",
    sentences:  "sentences",
    paragraphs: "paragraphs",
    count:      "count",
  },
} as const;

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function sentence(wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) words.push(WORDS[(i * 7 + words.length * 3) % WORDS.length]!);
  const first = words[0];
  words[0] = first!.charAt(0).toUpperCase() + first!.slice(1);
  return words.join(" ") + ".";
}

function generate(type: "words" | "sentences" | "paragraphs", count: number): string {
  if (type === "words") {
    const words: string[] = [];
    for (let i = 0; i < count; i++) words.push(WORDS[i % WORDS.length]!);
    return words.join(" ");
  }
  if (type === "sentences") {
    return Array.from({ length: count }, (_, i) => sentence(8 + (i % 5))).join(" ");
  }
  return Array.from({ length: count }, (_, p) =>
    Array.from({ length: 4 + (p % 3) }, (_, s) => sentence(8 + (s % 5))).join(" ")
  ).join("\n\n");
}

type UnitType = "words" | "sentences" | "paragraphs";
const COUNTS: Record<UnitType, number[]> = {
  words: [25, 50, 100, 200],
  sentences: [3, 5, 10, 20],
  paragraphs: [1, 3, 5, 10],
};

export function LoremIpsum() {
  const { lang } = useLang();
  const i = t(lang);
  const [type, setType] = useState<UnitType>("paragraphs");
  const [count, setCount] = useState(3);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("lorem-ipsum", "text");

  const output = useMemo(() => generate(type, count), [type, count]);

  const handleTypeChange = (v: string) => {
    const t = v as UnitType;
    setType(t);
    setCount(COUNTS[t][1] ?? COUNTS[t][0] ?? 3);
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => { trackRun(); copy(output); }}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {copied ? "✓" : i.copyAlt}
          </button>
        }
      >
        <OptBlock label={i.unitOpt}>
          <SegControl
            options={["words", "sentences", "paragraphs"]}
            value={type}
            onChange={(v) => handleTypeChange(v)}
          />
        </OptBlock>
        <OptBlock label={TR[lang].count}>
          <SegControl
            options={COUNTS[type]}
            value={count}
            onChange={(v) => setCount(v)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line bg-bg-code">
        <div className="p-[18px]">
          <p className="font-mono text-[12.5px] text-fg-1 leading-[1.8] whitespace-pre-wrap">{output}</p>
        </div>
        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span>{output.split(/\s+/).filter(Boolean).length} {TR[lang].words}</span>
          <span>{output.length} chars</span>
        </div>
      </div>
    </section>
  );
}
