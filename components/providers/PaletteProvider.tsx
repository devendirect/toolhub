"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type PaletteContextType = { open: boolean; setOpen: (v: boolean) => void };

const PaletteContext = createContext<PaletteContextType>({ open: false, setOpen: () => {} });

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <PaletteContext.Provider value={{ open, setOpen }}>{children}</PaletteContext.Provider>;
}

export function usePalette() {
  return useContext(PaletteContext);
}
