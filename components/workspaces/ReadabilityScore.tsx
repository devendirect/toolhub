"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { syllablesEn, syllablesFr, analyze, fleschLevel } from "@/lib/readability";
import type { ReadResult } from "@/lib/readability";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: {
    score:        "score de lisibilité",
    fkLabel:      "Flesch-Kincaid · indice de lisibilité",
    fogLabel:     "Gunning Fog · niveau scolaire estimé",
    avgSentLen:   "longueur moy. de phrase",
    avgSyllWord:  "syllabes moy. par mot",
    complexWords: "mots complexes (≥3 syl.)",
    sentences:    "phrases",
    tooShort:     "texte trop court (5 mots minimum)",
    placeholder:  "collez un texte pour l'analyser…",
    sampleBtn:    "exemple",
    levels:       ["très difficile", "difficile", "standard", "facile", "très facile"] as const,
  },
  en: {
    score:        "readability score",
    fkLabel:      "Flesch-Kincaid · reading ease",
    fogLabel:     "Gunning Fog · estimated grade level",
    avgSentLen:   "avg. sentence length",
    avgSyllWord:  "avg. syllables/word",
    complexWords: "complex words (≥3 syl.)",
    sentences:    "sentences",
    tooShort:     "text too short (5 words minimum)",
    placeholder:  "paste text to analyze…",
    sampleBtn:    "sample",
    levels:       ["very difficult", "difficult", "standard", "easy", "very easy"] as const,
  },
} as const;

const SAMPLE_EN = `The quick brown fox jumps over the lazy dog. This short sentence is very clear. However, the implementation of sophisticated algorithms requires careful consideration of multiple interdependent factors and technical constraints. Readability improves significantly when sentences remain concise and vocabulary stays accessible to the intended audience.`;
const SAMPLE_FR = `Le renard brun et vif bondit par-dessus le chien paresseux. Cette phrase est simple. Cependant, la mise en œuvre d'algorithmes sophistiqués nécessite une considération attentive de facteurs interdépendants complexes. La lisibilité s'améliore lorsque les phrases restent concises et le vocabulaire est accessible au lecteur ciblé.`;


function scoreColor(score: number): string {
  if (score >= 60) return "text-brand";
  if (score >= 35) return "text-hot";
  return "text-danger";
}

export function ReadabilityScore() {
  const { lang } = useLang();
  const i = t(lang);
  const [text, setText] = useState(lang === "fr" ? SAMPLE_FR : SAMPLE_EN);
  const trackRun = useTrackRun("readability", "text");
  const tracked = useRef(false);

  const result = useMemo(() => analyze(text, lang), [text, lang]);

  useEffect(() => {
    if (!tracked.current && result !== null) { tracked.current = true; trackRun(); }
  }, [result, trackRun]);

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* Input pane */}
        <div className="border-r border-line flex flex-col">
          <div className="flex items-center justify-between px-[14px] py-[9px] bg-bg-1 border-b border-line">
            <span className="font-mono text-[11px] text-dim">// {i.inputPane}</span>
            <div className="flex gap-3">
              <button
                onClick={() => setText(lang === "fr" ? SAMPLE_FR : SAMPLE_EN)}
                className="font-mono text-[11px] text-dim hover:text-brand transition-colors"
              >
                {TR[lang].sampleBtn}
              </button>
              <button
                onClick={() => setText("")}
                className="font-mono text-[11px] text-dim hover:text-fg transition-colors"
              >
                {i.clearInput}
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={TR[lang].placeholder}
            className="flex-1 min-h-[360px] p-[14px] bg-bg-code font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none"
            spellCheck={false}
          />
          <div className="px-[14px] py-[8px] border-t border-line bg-bg font-mono text-[11px] text-dim">
            {result
              ? `${result.wordCount} ${i.wordsLabel} · ${result.sentCount} ${TR[lang].sentences}`
              : "—"}
          </div>
        </div>

        {/* Scores pane */}
        <div className="flex flex-col">
          <div className="px-[14px] py-[9px] bg-bg-1 border-b border-line">
            <span className="font-mono text-[11px] text-dim">// {TR[lang].score}</span>
          </div>
          {!result ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <span className="font-mono text-[12px] text-dim-2">{TR[lang].tooShort}</span>
            </div>
          ) : (
            <div className="flex-1 divide-y divide-line">
              <div className="flex items-center gap-6 px-6 py-6">
                <div className="flex flex-col items-center shrink-0">
                  <span className={`font-mono text-[52px] font-bold leading-none ${scoreColor(result.flesch)}`}>
                    {result.flesch}
                  </span>
                  <span className="font-mono text-[10px] text-dim mt-1">/ 100</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`font-mono text-[14px] font-semibold ${scoreColor(result.flesch)}`}>
                    {fleschLevel(result.flesch, TR[lang].levels)}
                  </span>
                  <span className="font-mono text-[11px] text-dim">{TR[lang].fkLabel}</span>
                </div>
              </div>

              <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-line">
                <span className="font-mono text-[11px] text-dim">{TR[lang].fogLabel}</span>
                <span className="font-mono text-[13px] text-fg">
                  {result.fog}
                  <span className="text-[11px] text-dim-2 ml-2">≈ grade {Math.round(result.fog)}</span>
                </span>
              </div>
              <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-line">
                <span className="font-mono text-[11px] text-dim">{TR[lang].avgSentLen}</span>
                <span className="font-mono text-[13px] text-fg">{result.asl}</span>
              </div>
              <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-line">
                <span className="font-mono text-[11px] text-dim">{TR[lang].avgSyllWord}</span>
                <span className="font-mono text-[13px] text-fg">{result.asw}</span>
              </div>
              <div className="flex items-center justify-between px-[14px] py-[10px]">
                <span className="font-mono text-[11px] text-dim">{TR[lang].complexWords}</span>
                <span className="font-mono text-[13px] text-fg">{result.complexPct}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
