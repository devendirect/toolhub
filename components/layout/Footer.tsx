"use client";

import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { useLang } from "@/components/providers/I18nProvider";
import { LogoMark } from "@/components/brand/LogoMark";
import { CATEGORIES } from "@/lib/tools";
import { localePath } from "@/lib/localePath";
import { resetConsent } from "@/components/analytics/CookieBanner";

export function Footer() {
  const { lang } = useLang();
  const i = t(lang);

  const toolCats = CATEGORIES.filter((c) => c.id !== "all");

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
            <p className="font-mono text-[11px] text-dim-2 leading-relaxed max-w-[36ch]">{i.footerNote}</p>
          </div>

          {/* Outils par catégorie */}
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[11px] text-dim">{"// "}{i.navTools}</div>
            {toolCats.map((c) => (
              <Link
                key={c.id}
                href={localePath(lang, `/tools/${c.id}`)}
                className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150"
              >
                <span className="mr-2 text-dim">{c.glyph}</span>
                {c.label[lang].toLowerCase()}
              </Link>
            ))}
          </div>

          {/* Légal & infos */}
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[11px] text-dim">{"// "}{lang === "fr" ? "infos" : "info"}</div>
            <Link href={localePath(lang, "/guides")} className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150">
              guides
            </Link>
            <Link href={localePath(lang, "/faq")} className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150">
              faq
            </Link>
            <Link href={localePath(lang, "/about")} className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150">
              {i.about}
            </Link>
            <Link href={localePath(lang, "/contact")} className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150">
              contact
            </Link>
            <Link href={localePath(lang, "/privacy")} className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150">
              {i.privacy}
            </Link>
            <Link href={localePath(lang, "/legal")} className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150">
              {lang === "fr" ? "mentions légales" : "legal notice"}
            </Link>
            <Link href={localePath(lang, "/terms")} className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150">
              {i.terms}
            </Link>
            {/* Quand une CMP certifiée pilote la page, resetConsent lui rend la
                main et rouvre son écran : recharger effacerait cet écran. */}
            <button
              onClick={() => { if (!resetConsent()) window.location.reload(); }}
              className="font-mono text-[13px] text-fg-1 hover:text-fg transition-colors duration-150 text-left"
            >
              {lang === "fr" ? "gérer les cookies" : "manage cookies"}
            </button>
          </div>

          {/* Stack */}
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[11px] text-dim">{"// stack"}</div>
            <span className="font-mono text-[12px] text-dim">Next.js + Tailwind v4</span>
            <span className="font-mono text-[12px] text-dim">open-source / MIT</span>
            <span className="font-mono text-[12px] text-dim" suppressHydrationWarning>© {new Date().getFullYear()} {BRAND_NAME}</span>
          </div>

        </div>

        {/* Bottom rule */}
        <div className="border-t border-line pt-5 flex items-center justify-between">
          <span className="font-mono text-[11px] text-dim-2" suppressHydrationWarning>
            {`> session_end  ::  ${new Date().toISOString().slice(0, 19).replace("T", " ")}`}
          </span>
          <span className="font-mono text-[11px] text-dim-2">
            {lang === "fr" ? `fait par ${BRAND_NAME}` : `made by ${BRAND_NAME}`}
          </span>
        </div>
      </div>
    </footer>
  );
}
