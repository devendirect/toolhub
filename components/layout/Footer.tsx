"use client";

import Link from "next/link";
import { BRAND_NAME, REPO_URL } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { useLang } from "@/components/providers/I18nProvider";
import { LogoMark } from "@/components/brand/LogoMark";
import { CATEGORIES } from "@/lib/tools";
import { localePath } from "@/lib/localePath";
import { resetConsent } from "@/components/analytics/CookieBanner";

const COL_LINK = "font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150";
const LEGAL_LINK = "font-mono text-[11px] text-dim hover:text-fg transition-colors duration-150";

export function Footer() {
  const { lang } = useLang();
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
          </div>

        </div>

        {/* Bottom rule : session + liens légaux */}
        <div className="border-t border-line pt-5 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
          <span className="font-mono text-[11px] text-dim" suppressHydrationWarning>
            {`> session_end  ::  ${new Date().toISOString().slice(0, 19).replace("T", " ")}`}
          </span>
          <nav aria-label={lang === "fr" ? "informations légales" : "legal"} className="flex flex-wrap gap-x-4 gap-y-2">
            {legal.map((l) => (
              <Link key={l.href} href={localePath(lang, l.href)} className={LEGAL_LINK}>{l.label}</Link>
            ))}
            {/* Quand une CMP certifiée pilote la page, resetConsent lui rend la
                main et rouvre son écran : recharger effacerait cet écran. */}
            <button onClick={() => { if (!resetConsent()) window.location.reload(); }} className={`${LEGAL_LINK} text-left`}>
              {lang === "fr" ? "gérer les cookies" : "manage cookies"}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
