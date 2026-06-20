"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

const TR = {
  fr: {
    testString:      "texte de test",
    matchesPane:     "correspondances",
    matchesHere:     "les matches apparaîtront ici…",
    emptyMatch:      "(vide)",
    regexPlaceholder:"expression régulière…",
  },
  en: {
    testString:      "test string",
    matchesPane:     "matches",
    matchesHere:     "matches will appear here…",
    emptyMatch:      "(empty)",
    regexPlaceholder:"regular expression…",
  },
} as const;

interface RegexSegment { text: string; isMatch: boolean; matchIdx: number; }
interface RegexMatch { value: string; index: number; groups: string[]; }

function analyze(text: string, pattern: string, flags: string): {
  segments: RegexSegment[];
  matches: RegexMatch[];
  error: string | null;
} {
  if (!pattern) return { segments: [{ text, isMatch: false, matchIdx: -1 }], matches: [], error: null };
  try {
    const allFlags = flags.includes("g") ? flags : flags + "g";
    const regex = new RegExp(pattern, allFlags);
    const rawMatches = [...text.matchAll(regex)];
    const matches: RegexMatch[] = rawMatches.map((m) => ({
      value: m[0],
      index: m.index ?? 0,
      groups: m.slice(1).map((g) => g ?? "undefined"),
    }));

    const segments: RegexSegment[] = [];
    let last = 0;
    rawMatches.forEach((m, i) => {
      const start = m.index ?? 0;
      if (start > last) segments.push({ text: text.slice(last, start), isMatch: false, matchIdx: -1 });
      if (m[0].length > 0) {
        segments.push({ text: m[0], isMatch: true, matchIdx: i });
        last = start + m[0].length;
      } else {
        last = start + 1;
      }
    });
    if (last < text.length) segments.push({ text: text.slice(last), isMatch: false, matchIdx: -1 });

    return { segments, matches, error: null };
  } catch (e) {
    return { segments: [{ text, isMatch: false, matchIdx: -1 }], matches: [], error: (e as Error).message };
  }
}

const SAMPLES = [
  { label: "email",   pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "gi" },
  { label: "URL",     pattern: "https?://[^\\s]+", flags: "gi" },
  { label: "hex",     pattern: "#[0-9a-fA-F]{3,6}", flags: "g" },
  { label: "date",    pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g" },
];

const TEST_TEXT = `Contact us at hello@toolhub.io or support@example.com.
Visit https://toolhub.io or https://github.com/toolhub for more.
Colors: #00e08a, #7c5cff, #fff.
Release date: 2026-06-13.`;

const FLAG_LIST = ["i", "m", "s"] as const;
type Flag = typeof FLAG_LIST[number];

export function RegexTester() {
  const { lang } = useLang();
  const i = t(lang);

  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState<Set<Flag>>(new Set<Flag>(["i"]));
  const [text, setText] = useState(TEST_TEXT);

  const flagStr = ["g", ...FLAG_LIST.filter((f) => flags.has(f))].join("");
  const { segments, matches, error } = useMemo(() => analyze(text, pattern, flagStr), [text, pattern, flagStr]);

  const toggleFlag = (f: Flag) =>
    setFlags((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });

  const loadSample = (s: typeof SAMPLES[0]) => {
    setPattern(s.pattern);
    setFlags(new Set(FLAG_LIST.filter((f) => s.flags.includes(f))));
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-0 border border-line border-b-0 bg-bg-1">
        <span className="font-mono text-[14px] text-dim px-4 border-r border-line py-[11px]">/</span>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={TR[lang].regexPlaceholder}
          className="flex-1 bg-transparent font-mono text-[13px] text-brand px-4 py-[11px] outline-none placeholder:text-dim-2"
          spellCheck={false}
        />
        <span className="font-mono text-[14px] text-dim px-2 border-l border-line py-[11px]">/</span>
        <div className="flex items-center gap-1 px-3 border-l border-line py-[8px]">
          {(["g", ...FLAG_LIST] as string[]).map((f) => {
            const isG = f === "g";
            const active = isG || flags.has(f as Flag);
            return (
              <button
                key={f}
                onClick={() => !isG && toggleFlag(f as Flag)}
                disabled={isG}
                className={`w-7 h-7 font-mono text-[11px] rounded-[3px] transition-colors ${
                  active ? "bg-brand-soft text-brand border border-brand-mid" : "text-dim border border-transparent hover:border-line-2 hover:text-fg-1"
                } disabled:cursor-default`}
              >
                {f}
              </button>
            );
          })}
        </div>
        <div className="px-4 border-l border-line py-[11px] font-mono text-[12px] shrink-0">
          {error
            ? <span className="text-danger">✕ error</span>
            : <span className={matches.length > 0 ? "text-brand" : "text-dim"}>
                {matches.length} {"match(es)"}
              </span>}
        </div>
      </div>

      <div className="flex items-center gap-2 px-[14px] py-[9px] border border-line border-b-0 bg-bg">
        <span className="font-mono text-[10px] text-dim-2 uppercase tracking-[0.1em] mr-1">
          {i.samplesLabel}
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => loadSample(s)}
            className="font-mono text-[11px] px-[8px] py-[3px] border border-line text-dim hover:border-brand-mid hover:text-brand transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        <Pane
          title={TR[lang].testString}
          ext="txt"
          meta={`${text.length} chars`}
          actions={<PaneBtn onClick={() => setText("")}>{i.clearInput}</PaneBtn>}
          footer={<span>{text.split(/\r?\n/).length} {i.lines}</span>}
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-full min-h-[340px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </Pane>

        <Pane
          title={TR[lang].matchesPane}
          footer={
            error
              ? <span className="text-danger">✕ {error}</span>
              : <span>{matches.length > 0 ? `${matches.length} match(es) · /${pattern}/${flagStr}` : i.noMatches}</span>
          }
        >
          <div className="flex-1 flex flex-col bg-bg-code min-h-[340px]">
            {/* Highlighted text */}
            <div className="p-[14px] border-b border-line font-mono text-[12.5px] leading-[1.65] whitespace-pre-wrap break-all">
              {segments.length > 0
                ? segments.map((seg, i) =>
                    seg.isMatch ? (
                      <mark key={`${i}:m`} className="bg-brand-soft text-brand rounded-[2px] px-[1px]">
                        {seg.text}
                      </mark>
                    ) : (
                      <span key={`${i}:t`} className="text-fg-1">{seg.text}</span>
                    )
                  )
                : <span className="text-dim-2">{TR[lang].matchesHere}</span>}
            </div>

            {/* Match list */}
            {matches.length > 0 && (
              <div className="overflow-auto flex-1 divide-y divide-line">
                {matches.map((m, i) => (
                  <div key={`${m.index}:${m.value.slice(0, 8)}`} className="flex items-start gap-3 px-[14px] py-[8px]">
                    <span className="font-mono text-[10px] text-dim-2 w-5 shrink-0 pt-[2px]">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[12px] text-brand break-all">{m.value || TR[lang].emptyMatch}</span>
                      <span className="font-mono text-[11px] text-dim-2 ml-2">@{m.index}</span>
                      {m.groups.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.groups.map((g, gi) => (
                            <span key={gi} className="font-mono text-[10px] px-[6px] py-[1px] border border-line-2 text-fg-1">
                              ${gi + 1}: {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Pane>
      </div>
    </section>
  );
}
