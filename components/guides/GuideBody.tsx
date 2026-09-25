import Link from "next/link";
import type { GuideBlock, GuideSection } from "@/lib/guides";
import type { Lang } from "@/lib/types";

// Marquage en ligne volontairement minimal : `code` et [libellé](/chemin)
const INLINE = /(`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function Inline({ text, lang }: { text: string; lang: Lang }) {
  return (
    <>
      {text.split(INLINE).map((part, i) => {
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

function Block({ block, lang }: { block: GuideBlock; lang: Lang }) {
  if ("p" in block) return <p className="text-[15px] text-fg-1 leading-[1.75]"><Inline text={block.p} lang={lang} /></p>;
  if ("ul" in block || "ol" in block) {
    const items = "ul" in block ? block.ul : block.ol;
    const List = "ul" in block ? "ul" : "ol";
    return (
      <List className={`flex flex-col gap-2 pl-6 text-[15px] text-fg-1 leading-[1.7] ${"ul" in block ? "list-disc" : "list-decimal"}`}>
        {items.map((it) => <li key={it}><Inline text={it} lang={lang} /></li>)}
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
              {row.map((cell, c) => <td key={c} className="px-3 py-2 text-fg-1 align-top"><Inline text={cell} lang={lang} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GuideBody({ sections, lang }: { sections: GuideSection[]; lang: Lang }) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((sec) => (
        <section key={sec.h} className="flex flex-col gap-4">
          <h2 className="text-[22px] font-medium tracking-[-0.015em] text-fg">{sec.h}</h2>
          {sec.blocks.map((b, i) => <Block key={i} block={b} lang={lang} />)}
        </section>
      ))}
    </div>
  );
}
