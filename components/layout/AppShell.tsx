import { type ReactNode } from "react";
import type { Lang } from "@/lib/types";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PaletteLauncher } from "@/components/palette/PaletteLauncher";

export function AppShell({ children, lang }: { children: ReactNode; lang: Lang }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Dot-grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at top, black 30%, transparent 75%)",
        }}
      />
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-25"
        aria-hidden
        style={{
          background: "linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.18) 50%)",
          backgroundSize: "100% 3px",
        }}
      />

      <Header />

      <main className="relative z-10 flex-1 mx-auto w-full px-pad pb-20" style={{ maxWidth: "var(--maxw)" }}>
        {children}
      </main>

      <Footer lang={lang} />
      <PaletteLauncher />
    </div>
  );
}
