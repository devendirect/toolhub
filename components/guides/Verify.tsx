import type { Guide } from "@/lib/guides";
import type { Lang } from "@/lib/types";
import { TerminalWindow, TerminalPrompt } from "@/components/brand/TerminalWindow";
import { Cursor } from "@/components/brand/Cursor";
import { SectionHead } from "@/components/home/SectionHead";

/**
 * Vérification des faits d'un guide : badge sous le titre et bloc
 * `$ utilisio verify <slug>` en fin d'article. Ne s'affiche que si le guide a
 * une date `verified` : un guide pas encore vérifié n'annonce rien.
 */

const TEXT = {
  fr: {
    verified: "vérifié le",
    sources: (n: number) => (n > 1 ? `${n} sources` : "1 source"),
    detail: "voir le détail",
    heading: "// vérification des faits",
    source: "source",
    test: "test sur nos outils",
    recheck: "à revérifier",
    official: "officielle",
    secondary: "secondaire",
    list: "Sources",
  },
  en: {
    verified: "verified on",
    sources: (n: number) => (n > 1 ? `${n} sources` : "1 source"),
    detail: "see details",
    heading: "// fact check",
    source: "source",
    test: "tested on our tools",
    recheck: "recheck",
    official: "official",
    secondary: "secondary",
    list: "Sources",
  },
};

export function VerifyBadge({ guide, lang }: { guide: Guide; lang: Lang }) {
  if (!guide.verified) return null;
  const t = TEXT[lang];
  return (
    <a
      href="#verify"
      className="inline-flex flex-wrap items-center gap-x-2 font-mono text-[12px] text-brand border border-brand-mid bg-brand-soft px-[10px] py-[5px] rounded-[3px] mb-6 hover:brightness-110 transition-all"
    >
      <span>✓ {t.verified} <time dateTime={guide.verified}>{guide.verified}</time></span>
      <span className="text-fg-1">· {t.sources(guide.sources?.length ?? 0)} · {t.detail}</span>
    </a>
  );
}

export function VerifyBlock({ guide, lang, cites }: { guide: Guide; lang: Lang; cites: Map<string, number> }) {
  if (!guide.verified) return null;
  const t = TEXT[lang];
  const sources = [...(guide.sources ?? [])].sort((a, b) => (cites.get(a.id) ?? 0) - (cites.get(b.id) ?? 0));
  const byId = new Map(sources.map((s) => [s.id, s]));

  return (
    <section id="verify" className="mt-14 max-w-[72ch] scroll-mt-24">
      <SectionHead label={t.heading} />
      <TerminalWindow title={`verify · ${guide.slug}`}>
        <TerminalPrompt>utilisio verify {guide.slug}</TerminalPrompt>

        {(guide.claims?.length ?? 0) > 0 && (
          <ul className="mt-3 flex flex-col gap-3">
            {guide.claims!.map((c) => {
              const src = byId.get(c.source);
              return (
                <li key={c.text.en} className="grid grid-cols-[1.5ch_1fr] gap-x-3">
                  <span className="text-brand" aria-hidden>✓</span>
                  <span>
                    <span className="text-fg [font-family:var(--font-ui)] text-[14px]">{c.text[lang]}</span>
                    <span className="block text-dim text-[12px]">
                      {t.source} :{" "}
                      {src ? (
                        <a href={`#src-${src.id}`} className="text-syntax-key hover:underline">[{cites.get(src.id)}] {src.publisher}</a>
                      ) : (
                        t.test
                      )}
                      {" · "}{t.verified} <time dateTime={guide.verified}>{guide.verified}</time>
                      {c.recheck && <> · {t.recheck} {c.recheck[lang]}</>}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {sources.length > 0 && (
          <>
            <h3 className="mt-6 text-dim text-[13px] font-normal">{"# "}{t.list}</h3>
            <ol className="mt-2 flex flex-col gap-2">
              {sources.map((s) => (
                <li key={s.id} id={`src-${s.id}`} className="grid grid-cols-[3.5ch_1fr] gap-x-2 scroll-mt-24 target:bg-brand-soft">
                  <span className="text-dim">[{cites.get(s.id)}]</span>
                  <span>
                    <a href={s.url} target="_blank" rel="noopener" className="text-syntax-key hover:underline">{s.title}</a>
                    <span className="text-dim"> · {s.publisher} · {s.official ? t.official : t.secondary}</span>
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}

        <TerminalPrompt className="mt-5"><Cursor /></TerminalPrompt>
      </TerminalWindow>
    </section>
  );
}
