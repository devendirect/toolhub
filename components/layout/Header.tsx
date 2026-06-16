"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BRAND_NAME, BRAND_VERSION } from "@/lib/brand";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { localePath } from "@/lib/localePath";
import { useLang } from "@/components/providers/I18nProvider";
import { usePalette } from "@/components/providers/PaletteProvider";
import { LogoMark } from "@/components/brand/LogoMark";
import { TweaksPopover } from "@/components/layout/TweaksPopover";

const NAV = [
  { path: "/",      labelKey: "navHome"  },
  { path: "/tools", labelKey: "navTools" },
] as const;

export function Header() {
  const { lang } = useLang();
  const { setOpen } = usePalette();
  const pathname = usePathname();
  const router = useRouter();
  const i = t(lang);

  const switchLang = (l: Lang) => {
    // Swap the lang segment in the current pathname
    const segments = pathname.split("/");
    segments[1] = l;
    const newPath = segments.join("/") || `/${l}`;
    router.push(newPath);
    // Persist preference for middleware
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-line"
      style={{ backgroundColor: "color-mix(in oklab, var(--bg) 86%, transparent)", backdropFilter: "blur(12px) saturate(1.2)" }}
    >
      <div className="mx-auto flex items-center gap-8 px-pad py-[14px]" style={{ maxWidth: "var(--maxw)" }}>

        {/* Logo */}
        <Link href={localePath(lang, "/")} className="inline-flex items-center gap-[10px] text-[17px] font-semibold tracking-[-0.02em] text-fg group">
          <span className="text-brand transition-[filter] duration-200 group-hover:[filter:drop-shadow(0_0_8px_var(--brand-mid))]">
            <LogoMark size={26} />
          </span>
          <span>
            <span className="text-fg">{BRAND_NAME.slice(0, 4)}</span>
            <span className="text-brand">{BRAND_NAME.slice(4)}</span>
          </span>
          <span className="font-mono text-[11px] text-dim border border-line rounded-[3px] px-[6px] py-[2px] ml-1">
            v{BRAND_VERSION}
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex gap-1">
          {NAV.map(({ path, labelKey }) => {
            const href = localePath(lang, path);
            const isActive = path === "/"
              ? pathname === `/${lang}` || pathname === `/${lang}/`
              : pathname.startsWith(`/${lang}${path}`);
            return (
              <Link
                key={path}
                href={href}
                className={`font-mono text-[13px] px-[10px] py-[6px] rounded transition-colors duration-150 ${
                  isActive ? "text-brand" : "text-fg-1 hover:text-fg hover:bg-bg-1"
                }`}
              >
                <span className="text-dim">/</span>
                {i[labelKey]}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="ml-auto flex items-center gap-4">
          {/* ⌘K trigger */}
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-[10px] py-[6px] font-mono text-[12px] text-dim border border-line-2 rounded bg-bg-1 transition-colors duration-150 hover:border-brand-mid hover:text-fg-1"
          >
            <span className="text-dim">{">"}</span>
            <span>{i.searchPlaceholder}</span>
            <kbd className="inline-block min-w-[22px] text-center px-[5px] py-[1px] font-mono text-[10px] border border-line-2 rounded-[3px] text-fg-1 bg-bg-1">
              ⌘K
            </kbd>
          </button>

          {/* Status */}
          <div className="hidden sm:inline-flex items-center gap-2 text-[12px]">
            <span className="inline-block w-[7px] h-[7px] rounded-full bg-brand" style={{ boxShadow: "0 0 8px var(--brand)" }} />
            <span className="font-mono text-dim">{i.operational}</span>
          </div>

          {/* Tweaks */}
          <TweaksPopover />

          {/* Lang switch */}
          <div className="inline-flex items-center gap-[6px] font-mono text-[12px]">
            {(["fr", "en"] as const).map((l, idx) => (
              <Fragment key={l}>
                {idx > 0 && <span className="text-dim">/</span>}
                <button
                  onClick={() => switchLang(l)}
                  className={`px-[2px] transition-colors ${lang === l ? "text-fg border-b border-brand" : "text-dim hover:text-fg-1"}`}
                >
                  {l}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
