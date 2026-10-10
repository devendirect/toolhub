import Link from "next/link";
import type { GuideBlock, GuideSection, SupportRow } from "@/lib/guides";
import { TerminalWindow, TerminalPrompt } from "@/components/brand/TerminalWindow";
import type { Lang } from "@/lib/types";

// Marquage en ligne volontairement minimal : `code`, [libellé](/chemin) et [^source]
const INLINE = /(`[^`]+`|\[\^[a-z0-9-]+\]|\[[^\]]+\]\([^)]+\))/g;

/** Numéro affiché de chaque source (voir sourceNumbers dans lib/guides.ts). */
type Cites = Map<string, number>;

function Inline({ text, lang, cites }: { text: string; lang: Lang; cites: Cites }) {
  return (
    <>
      {text.split(INLINE).map((part, i) => {
        const cite = /^\[\^([a-z0-9-]+)\]$/.exec(part);
        if (cite) {
          const n = cites.get(cite[1]!);
          return n ? (
            <sup key={i}>
              <a href={`#src-${cite[1]}`} className="font-mono text-[10px] text-brand px-[1px] hover:underline">[{n}]</a>
            </sup>
          ) : null;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="font-mono text-[12.5px] bg-bg-2 border border-line px-[5px] py-[1px] rounded-[3px]">{part.slice(1, -1)}</code>;
        }
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (m) {
          const href = m[2]!.startsWith("/") ? `/${lang}${m[2]}` : m[2]!;
          return <Link key={i} href={href} className="text-brand underline underline-offset-2 hover:no-underline">{m[1]}</Link>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const STATE: Record<SupportRow["state"], { mark: string; cls: string; label: Record<Lang, string> }> = {
  yes:     { mark: "●", cls: "text-brand",  label: { fr: "oui",        en: "yes" } },
  partial: { mark: "◐", cls: "text-hot",    label: { fr: "en partie",  en: "partial" } },
  no:      { mark: "○", cls: "text-dim-2",  label: { fr: "non",        en: "no" } },
};

/** Tableau de prise en charge en sortie terminal : un vrai <table>, lisible sans le style. */
function Support({ query, rows, lang }: { query: string; rows: SupportRow[]; lang: Lang }) {
  return (
    <TerminalWindow title={`support · ${query}`}>
      <TerminalPrompt>support {query}</TerminalPrompt>
      <table className="w-full mt-2 text-[12.5px]">
        <caption className="sr-only">{lang === "fr" ? `Prise en charge : ${query}` : `Support: ${query}`}</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">{lang === "fr" ? "état" : "status"}</th>
            <th scope="col">{lang === "fr" ? "navigateur" : "browser"}</th>
            <th scope="col">{lang === "fr" ? "détail" : "details"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="align-top">
              <td className={`pr-3 w-[1.5ch] ${STATE[r.state].cls}`}>
                <span aria-hidden>{STATE[r.state].mark}</span>
                <span className="sr-only">{STATE[r.state].label[lang]}</span>
              </td>
              <th scope="row" className="pr-4 text-left font-normal text-fg whitespace-nowrap">{r.label}</th>
              <td className="text-dim">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TerminalWindow>
  );
}

function Block({ block, lang, cites }: { block: GuideBlock; lang: Lang; cites: Cites }) {
  if ("support" in block) return <Support query={block.support.query} rows={block.support.rows} lang={lang} />;
  if ("p" in block) return <p className="text-[15px] text-fg-1 leading-[1.75]"><Inline text={block.p} lang={lang} cites={cites} /></p>;
  if ("ul" in block || "ol" in block) {
    const items = "ul" in block ? block.ul : block.ol;
    const List = "ul" in block ? "ul" : "ol";
    return (
      <List className={`flex flex-col gap-2 pl-6 text-[15px] text-fg-1 leading-[1.7] ${"ul" in block ? "list-disc" : "list-decimal"}`}>
        {items.map((it) => <li key={it}><Inline text={it} lang={lang} cites={cites} /></li>)}
      </List>
    );
  }
  if ("code" in block) {
    return (
      <pre className="bg-bg-code border border-line p-4 overflow-x-auto font-mono text-[12.5px] text-fg leading-[1.6]">
        <code>{block.code}</code>
      </pre>
    );
  }
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full text-[13.5px]">
        <thead className="bg-bg-1">
          <tr>{block.table.head.map((h) => <th key={h} className="text-left font-mono text-[12px] text-dim px-3 py-2 border-b border-line">{h}</th>)}</tr>
        </thead>
        <tbody>
          {block.table.rows.map((row, r) => (
            <tr key={r} className="border-b border-line last:border-b-0">
              {row.map((cell, c) => <td key={c} className={`px-3 py-2 text-fg-1 align-top ${c === 0 ? "whitespace-nowrap" : ""}`}><Inline text={cell} lang={lang} cites={cites} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GuideBody({ sections, lang, cites = new Map() }: { sections: GuideSection[]; lang: Lang; cites?: Cites }) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((sec) => (
        <section key={sec.h} className="flex flex-col gap-4">
          <h2 className="text-[22px] font-medium tracking-[-0.015em] text-fg">{sec.h}</h2>
          {sec.blocks.map((b, i) => <Block key={i} block={b} lang={lang} cites={cites} />)}
        </section>
      ))}
    </div>
  );
}
