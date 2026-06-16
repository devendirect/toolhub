"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/types";

type I18nContextType = { lang: Lang };

const I18nContext = createContext<I18nContextType>({ lang: "en" });

export function I18nProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lang: Lang = pathname.startsWith("/fr") ? "fr" : "en";

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  return <I18nContext.Provider value={{ lang }}>{children}</I18nContext.Provider>;
}

export function useLang() {
  return useContext(I18nContext);
}
