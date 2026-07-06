"use client";

import { useState, useMemo, useRef } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useTrackRun } from "@/hooks/useTrackRun";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

const TR = {
  fr: {
    characters:  "caractères",
    noSpaces:    "sans espaces",
    sentences:   "phrases",
    paragraphs:  "paragraphes",
    readTime:    "lecture (~238 mpm)",
    statistics:  "statistiques",
    realTime:    "analyse en temps réel",
    pastePlaceholder: "collez votre texte ici…",
  },
  en: {
    characters:  "characters",
    noSpaces:    "no spaces",
    sentences:   "sentences",
    paragraphs:  "paragraphs",
    readTime:    "read time (~238 wpm)",
    statistics:  "statistics",
    realTime:    "real-time analysis",
    pastePlaceholder: "paste your text here…",
  },
} as const;

const SAMPLE = `La boîte à outils du développeur moderne. Convertir, encoder, générer, formatter — une commande, un résultat. La plupart des outils tournent 100 % en local.`;

const WPM = 238;

interface WordSegment { isWordLike: boolean; }
type SegmenterCtor = new (locale?: string, opts?: { granularity: string }) => {
  segment(s: string): Iterable<WordSegment>;
};

export function countWords(str: string): number {
  if (!str.trim()) return 0;
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const Seg = (Intl as unknown as { Segmenter: SegmenterCtor }).Segmenter;
    const seg = new Seg(undefined, { granularity: "word" });
    return [...seg.segment(str)].filter((s) => s.isWordLike).length;
  }
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function countSentences(str: string): number {
  return (str.match(/[.!?]+/g) ?? []).length;
}

export function countParagraphs(str: string): number {
  return str.split(/\n{2,}/).filter((p) => p.trim()).length;
}

export function WordCounter() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const trackRun = useTrackRun("word-counter", "text");
  const tracked = useRef(false);

  const stats = useMemo(() => {
    const words = countWords(input);
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, "").length;
    const sentences = countSentences(input);
    const paragraphs = countParagraphs(input);
    const readSec = Math.ceil((words / WPM) * 60);
    const readTime = readSec < 60
      ? `${readSec}s`
      : `${Math.floor(readSec / 60)}m ${readSec % 60}s`;
    return { words, chars, charsNoSpace, sentences, paragraphs, readTime };
  }, [input]);

  const STAT_ROWS = [
    { label: i.wordsLabel,             value: stats.words.toLocaleString() },
    { label: TR[lang].characters,      value: stats.chars.toLocaleString() },
    { label: TR[lang].noSpaces,        value: stats.charsNoSpace.toLocaleString() },
    { label: TR[lang].sentences,       value: stats.sentences.toLocaleString() },
    { label: TR[lang].paragraphs,      value: stats.paragraphs.toLocaleString() },
    { label: TR[lang].readTime,        value: stats.readTime },
  ];

  return (
    <section className="mb-10">
      {/* No OptionsBar — no options needed */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.input}
          ext="txt"
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>{stats.chars} chars · {stats.words} {i.wordsLabel}</span>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => { const v = e.target.value; if (!tracked.current && v) { tracked.current = true; trackRun(); } setInput(v); }}
              placeholder={TR[lang].pastePlaceholder}
              className="w-full h-full min-h-[380px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={TR[lang].statistics}
          footer={<span>{TR[lang].realTime} ✓</span>}
        >
          <div className="flex-1 bg-bg-code p-[14px] flex flex-col gap-[6px] min-h-[380px]">
            {STAT_ROWS.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-[10px] border-b border-line last:border-b-0"
              >
                <span className="font-mono text-[12px] text-dim uppercase tracking-[0.08em]">{label}</span>
                <span className="font-mono text-[22px] font-medium text-fg tracking-[-0.02em]">{value}</span>
              </div>
            ))}
          </div>
        </Pane>
      </div>
    </section>
  );
}
