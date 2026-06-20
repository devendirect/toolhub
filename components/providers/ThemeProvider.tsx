"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Accent, Density, UIFont } from "@/lib/theme";

export type { Accent, Density, UIFont };

type ThemeContextType = {
  accent: Accent;
  density: Density;
  font: UIFont;
  setAccent:  (v: Accent)  => void;
  setDensity: (v: Density) => void;
  setFont:    (v: UIFont)  => void;
};

const ThemeContext = createContext<ThemeContextType>({
  accent: "green", density: "regular", font: "geist",
  setAccent: () => {}, setDensity: () => {}, setFont: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accent,  setAccent]  = useState<Accent>("green");
  const [density, setDensity] = useState<Density>("regular");
  const [font,    setFont]    = useState<UIFont>("geist");

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.accent  = accent;
    root.dataset.density = density;
    root.dataset.font    = font;
  }, [accent, density, font]);

  return (
    <ThemeContext.Provider value={{ accent, density, font, setAccent, setDensity, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
