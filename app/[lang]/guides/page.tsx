import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES, readingMinutes } from "@/lib/guides";
import { SITE_URL } from "@/lib/brand";
import { coerceLang } from "@/lib/localePath";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const title = l === "fr" ? "Guides pratiques : formats, sécurité web, SEO" : "Practical guides: formats, web security, SEO";
  const description = l === "fr"
    ? "Des guides écrits à partir de nos outils : choisir un format de fichier, comprendre un JWT ou des en-têtes HTTP, soigner l'aperçu de vos liens partagés."
    : "Guides written from what our tools do: choosing a file format, understanding a JWT or HTTP headers, getting your shared link previews right.";
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/guides`,
      languages: { en: `${SITE_URL}/en/guides`, fr: `${SITE_URL}/fr/guides`, "x-default": `${SITE_URL}/en/guides` },
    },
    openGraph: { title, description, url: `${SITE_URL}/${l}/guides` },
  };
}

export default async function GuidesIndex({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  const fr = l === "fr";
  const guides = [...GUIDES].sort((a, b) => b.updated.localeCompare(a.updated));

  return (
    <div className="pt-9 pb-12">
      <div className="flex gap-[6px] font-mono text-[12px] text-dim mb-7">
        <Link href={`/${l}`} className="hover:text-brand transition-colors">~</Link>
        <span>/</span>
        <span className="text-brand">guides</span>
      </div>

      <header className="max-w-[72ch] mb-10">
        <h1 className="text-[36px] font-medium tracking-[-0.025em] leading-none mb-4">Guides</h1>
        <p className="text-[15px] text-fg-1 leading-[1.7]">
          {fr
            ? "Chaque outil de ce site répond à une question précise ; ces guides prennent le temps de répondre aux questions qui viennent autour. Ils partent de ce que les outils font vraiment, testés sur de vraies données, et renvoient vers eux quand c'est utile."
            : "Each tool on this site answers one narrow question; these guides take the time to answer the questions around it. They start from what the tools actually do, tested on real input, and point to them where it helps."}
        </p>
      </header>

      <ul className="flex flex-col divide-y divide-line border border-line">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/${l}/guides/${g.slug}`} className="flex flex-col gap-2 px-5 py-5 hover:bg-bg-2 transition-colors">
              <span className="text-[18px] text-fg font-medium">{g[l].title}</span>
              <span className="text-[14px] text-fg-1 leading-relaxed">{g[l].description}</span>
              <span className="font-mono text-[11px] text-dim">{readingMinutes(g[l])} min {fr ? "de lecture" : "read"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
