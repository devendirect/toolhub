"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

const SAMPLE = `La boîte à outils du développeur moderne. Convertir, encoder, générer, formatter — une commande, un résultat. La plupart des outils tournent 100 % en local.`;

const WPM = 238;

function countWords(str: string): number {
  if (!str.trim()) return 0;
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new (Intl as any).Segmenter(undefined, { granularity: "word" });
    return [...seg.segment(str)].filter((s: any) => s.isWordLike).length;
  }
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(str: string): number {
  return (str.match(/[.!?]+/g) ?? []).length;
}

function countParagraphs(str: string): number {
  return str.split(/\n{2,}/).filter((p) => p.trim()).length;
}

export function WordCounter() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);

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
    { label: lang === "fr" ? "mots" : "words",              value: stats.words.toLocaleString() },
    { label: lang === "fr" ? "caractères" : "characters",   value: stats.chars.toLocaleString() },
    { label: lang === "fr" ? "sans espaces" : "no spaces",  value: stats.charsNoSpace.toLocaleString() },
    { label: lang === "fr" ? "phrases" : "sentences",       value: stats.sentences.toLocaleString() },
    { label: lang === "fr" ? "paragraphes" : "paragraphs",  value: stats.paragraphs.toLocaleString() },
    { label: lang === "fr" ? "lecture (~238 mpm)" : "read time (~238 wpm)", value: stats.readTime },
  ];

  return (
    <section className="mb-10">
      {/* No OptionsBar — no options needed */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={i.input}
          ext="txt"
          actions={<PaneBtn onClick={() => setInput("")}>{i.clear}</PaneBtn>}
          footer={<span>{stats.chars} chars · {stats.words} {lang === "fr" ? "mots" : "words"}</span>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "fr" ? "collez votre texte ici…" : "paste your text here…"}
              className="w-full h-full min-h-[380px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={lang === "fr" ? "statistiques" : "statistics"}
          footer={<span>{lang === "fr" ? "analyse en temps réel" : "real-time analysis"} ✓</span>}
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
