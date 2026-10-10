import Link from "next/link";
import { BRAND_NAME, REPO_URL, YOUTUBE_URL, TIKTOK_URL } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { LogoMark } from "@/components/brand/LogoMark";
import { CATEGORIES } from "@/lib/tools";
import { localePath } from "@/lib/localePath";
import type { Lang } from "@/lib/types";
import { ManageCookiesButton, SessionClock } from "./FooterClient";

const COL_LINK = "font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150";
const LEGAL_LINK = "font-mono text-[11px] text-dim hover:text-fg transition-colors duration-150";

/**
 * Composant serveur : le catalogue (lib/tools) et le dictionnaire ne partent
 * plus dans le JavaScript de chaque page pour afficher cinq liens.
 */
export function Footer({ lang }: { lang: Lang }) {
  const i = t(lang);

  const toolCats = CATEGORIES.filter((c) => c.id !== "all");
  const resources = [
    { href: "/guides",    label: "guides" },
    { href: "/changelog", label: lang === "fr" ? "nouveautés" : "what's new" },
    { href: "/faq",       label: "faq" },
  ];
  const legal = [
    { href: "/privacy", label: i.privacy },
    { href: "/legal",   label: lang === "fr" ? "mentions légales" : "legal notice" },
    { href: "/terms",   label: i.terms },
  ];

  return (
    <footer className="border-t border-line mt-auto">
      <div className="mx-auto px-pad py-[56px]" style={{ maxWidth: "var(--maxw)" }}>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gap mb-12">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[17px] font-semibold tracking-[-0.02em]">
              <span className="text-brand"><LogoMark size={32} /></span>
              <span>
                <span className="text-fg">{BRAND_NAME.slice(0, 4)}</span>
                <span className="text-brand">{BRAND_NAME.slice(4)}</span>
              </span>
            </div>
            <p className="font-mono text-[12px] text-dim leading-relaxed">{i.footerTagline}</p>
            <p className="font-mono text-[11px] text-dim leading-relaxed max-w-[36ch]">{i.footerNote}</p>
            <p className="font-mono text-[11px] text-dim" suppressHydrationWarning>
              © {new Date().getFullYear()} {BRAND_NAME} · Next.js + Tailwind v4
            </p>
          </div>

          {/* Outils par catégorie */}
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[11px] text-dim">{"// "}{i.navTools}</div>
            {toolCats.map((c) => (
              <Link
                key={c.id}
                href={localePath(lang, `/tools/${c.id}`)}
                className={COL_LINK}
              >
                <span className="mr-2 text-dim">{c.glyph}</span>
                {c.label[lang].toLowerCase()}
              </Link>
            ))}
          </div>

          {/* Ressources */}
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[11px] text-dim">{"// "}{lang === "fr" ? "ressources" : "resources"}</div>
            {resources.map((l) => (
              <Link key={l.href} href={localePath(lang, l.href)} className={COL_LINK}>{l.label}</Link>
            ))}
          </div>

          {/* Le site */}
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[11px] text-dim">{"// "}{BRAND_NAME}</div>
            <Link href={localePath(lang, "/about")} className={COL_LINK}>{i.about}</Link>
            <Link href={localePath(lang, "/contact")} className={COL_LINK}>contact</Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={COL_LINK}>open-source / MIT ↗</a>
            {/* rel="me" : relie le site à ses profils officiels */}
            <a href={YOUTUBE_URL} target="_blank" rel="me noopener noreferrer" className={COL_LINK}>{lang === "fr" ? "tutos" : "tutorials"} youtube ↗</a>
            <a href={TIKTOK_URL} target="_blank" rel="me noopener noreferrer" className={COL_LINK}>tiktok ↗</a>
          </div>

        </div>

        {/* Bottom rule : session + liens légaux */}
        <div className="border-t border-line pt-5 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
          <SessionClock className="font-mono text-[11px] text-dim" />
          <nav aria-label={lang === "fr" ? "informations légales" : "legal"} className="flex flex-wrap gap-x-4 gap-y-2">
            {legal.map((l) => (
              <Link key={l.href} href={localePath(lang, l.href)} className={LEGAL_LINK}>{l.label}</Link>
            ))}
            <ManageCookiesButton lang={lang} className={`${LEGAL_LINK} text-left`} />
          </nav>
        </div>
      </div>
    </footer>
  );
}
