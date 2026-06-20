"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { I18nProvider } from "./I18nProvider";
import { PaletteProvider } from "./PaletteProvider";
import { FavoritesProvider } from "./FavoritesProvider";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/analytics/CookieBanner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <FavoritesProvider>
          <PaletteProvider>{children}</PaletteProvider>
        </FavoritesProvider>
        <Toaster />
        <CookieBanner />
      </I18nProvider>
    </ThemeProvider>
  );
}
