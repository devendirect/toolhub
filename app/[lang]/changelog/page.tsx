import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, BRAND_NAME } from "@/lib/brand";
import { coerceLang } from "@/lib/localePath";
import { jsonLdString, ORG_REF } from "@/lib/jsonld";
import { TOOLS } from "@/lib/tools";
import { findGuide } from "@/lib/guides";
import { CHANGELOG, latestChangeDate, type ChangeEntry, type ChangeKind } from "@/lib/changelog";
import type { Lang } from "@/lib/types";
import { Cursor } from "@/components/brand/Cursor";
import { TerminalWindow, TerminalPrompt } from "@/components/brand/TerminalWindow";

interface Props {
  params: Promise<{ lang: string }>;
}

const TEXT = {
  fr: {
    crumb: "nouveautés",
    h1: "Nouveautés",
    title: "Nouveautés : outils ajoutés et corrections",
    description: "Ce qui change sur utilisio : nouveaux outils, fonctions ajoutées et bugs corrigés. Chaque entrée est datée et renvoie vers l'outil concerné.",
    lead: "Ce qui change sur utilisio : nouveaux outils, fonctions ajoutées, bugs corrigés, outils retirés. Une entrée à chaque changement qu'un visiteur peut constater, datée, avec le lien vers l'outil ou le guide concerné.",
    updated: "dernière mise à jour",
    anchor: "lien vers cette entrée",
    kinds: { new: "nouveau", improved: "amélioré", fixed: "corrigé", removed: "retiré" } as Record<ChangeKind, string>,
    locale: "fr-FR",
  },
  en: {
    crumb: "what's new",
    h1: "What's new",
    title: "What's new: added tools and fixes",
    description: "What changes on utilisio: new tools, added features and fixed bugs. Every entry is dated and links to the tool or guide it concerns.",
    lead: "What changes on utilisio: new tools, added features, fixed bugs, withdrawn tools. One entry for every change a visitor can notice, dated, with a link to the tool or guide it concerns.",
    updated: "last updated",
    anchor: "link to this entry",
    kinds: { new: "new", improved: "improved", fixed: "fixed", removed: "removed" } as Record<ChangeKind, string>,
    locale: "en-US",
  },
};

const KIND_CLASS: Record<ChangeKind, string> = {
  new:      "text-brand",
  improved: "text-syntax-key",
  fixed:    "text-hot",
  removed:  "text-danger",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const { title, description } = TEXT[l];
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/changelog`,
      languages: { en: `${SITE_URL}/en/changelog`, fr: `${SITE_URL}/fr/changelog`, "x-default": `${SITE_URL}/en/changelog` },
    },
    openGraph: { title, description, url: `${SITE_URL}/${l}/changelog` },
  };
}

/** Entrées regroupées par mois (AAAA-MM), dans l'ordre du journal. */
function byMonth(entries: ChangeEntry[]): [string, ChangeEntry[]][] {
  const groups = new Map<string, ChangeEntry[]>();
  for (const e of entries) {
    const key = e.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  return [...groups.entries()];
}

function monthLabel(key: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${key}-01T00:00:00Z`));
}

function fullDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** Liens d'une entrée : outils, guides, puis liens libres. Libellés tirés du catalogue. */
function entryLinks(e: ChangeEntry, l: Lang): { href: string; label: string; external: boolean }[] {
  const tools = (e.tools ?? []).flatMap((slug) => {
    const tool = TOOLS.find((t) => t.slug === slug && !t.comingSoon);
    return tool ? [{ href: `/${l}/t/${slug}`, label: tool.name[l], external: false }] : [];
  });
  const guides = (e.guides ?? []).flatMap((slug) => {
    const guide = findGuide(slug);
    return guide ? [{ href: `/${l}/guides/${slug}`, label: guide[l].title, external: false }] : [];
  });
  const free = (e.links ?? []).map((link) => {
    const external = /^https?:\/\//.test(link.href);
    return { href: external ? link.href : `/${l}${link.href}`, label: link.label[l], external };
  });
  return [...tools, ...guides, ...free];
}

export default async function ChangelogPage({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  const t = TEXT[l];
  const updated = latestChangeDate();
  const url = `${SITE_URL}/${l}/changelog`;

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: t.title,
    description: t.description,
    inLanguage: l === "fr" ? "fr-FR" : "en",
    dateModified: updated,
    isPartOf: { "@type": "WebSite", name: BRAND_NAME, url: SITE_URL },
    publisher: ORG_REF,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND_NAME, item: `${SITE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: t.h1, item: url },
    ],
  };

  return (
    <div className="pt-9 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }} />

      <div className="flex gap-[6px] font-mono text-[12px] text-dim mb-7">
        <Link href={`/${l}`} className="hover:text-brand transition-colors">~</Link>
        <span>/</span>
        <span className="text-brand">{t.crumb}</span>
      </div>

      <header className="max-w-[72ch] mb-8">
        <h1 className="text-[36px] font-medium tracking-[-0.025em] leading-none mb-4">{t.h1}</h1>
        <p className="text-[15px] text-fg-1 leading-[1.7] mb-4">{t.lead}</p>
        <p className="font-mono text-[12px] text-dim">
          {t.updated} : <time dateTime={updated}>{fullDate(updated, t.locale)}</time>
        </p>
      </header>

      {/* Fenêtre terminal : tout le contenu est rendu côté serveur, en vrais titres et paragraphes. */}
      <TerminalWindow title={`${BRAND_NAME} · changelog`} className="max-w-[880px]">
          <TerminalPrompt>{BRAND_NAME} changelog</TerminalPrompt>

          {byMonth(CHANGELOG).map(([month, entries]) => (
            <section key={month} aria-labelledby={`m-${month}`} className="mt-7">
              <h2 id={`m-${month}`} className="text-dim text-[13px] font-normal">
                {"# "}{monthLabel(month, t.locale)}
              </h2>

              {entries.map((e) => (
                <article key={e.id} id={e.id} className="group mt-5 scroll-mt-24">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <time dateTime={e.date} className="text-dim shrink-0">{e.date}</time>
                    <span className={`${KIND_CLASS[e.kind]} shrink-0`}>[{t.kinds[e.kind]}]</span>
                    <h3 className="text-fg font-medium text-[13px] font-mono">
                      {e.text[l].title}
                      <a href={`#${e.id}`} className="ml-2 text-dim-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label={t.anchor}>#</a>
                    </h3>
                  </div>
                  <p className="sm:pl-[4ch] mt-1 [font-family:var(--font-ui)] text-[14px] text-fg-1 leading-[1.7] max-w-[72ch]">
                    {e.text[l].body}
                  </p>
                  {entryLinks(e, l).length > 0 && (
                    <ul className="sm:pl-[4ch] mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {entryLinks(e, l).map((link) => (
                        <li key={link.href}>
                          {link.external ? (
                            <a href={link.href} target="_blank" rel="noopener" className="text-brand hover:underline">→ {link.label}</a>
                          ) : (
                            <Link href={link.href} className="text-brand hover:underline">→ {link.label}</Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </section>
          ))}

          <TerminalPrompt className="mt-7"><Cursor /></TerminalPrompt>
      </TerminalWindow>
    </div>
  );
}
