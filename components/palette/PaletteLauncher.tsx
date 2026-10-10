"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePalette } from "@/components/providers/PaletteProvider";

// La palette (cmdk, catalogue complet FR/EN, recherche) pèse ~60 Ko : elle n'est
// téléchargée qu'à la première ouverture, puis reste montée.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

export function PaletteLauncher() {
  const { open, setOpen } = usePalette();
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Première ouverture (bouton du header, champ de l'accueil ou raccourci) : on charge
  if (open && !wanted) setWanted(true);

  return wanted ? <CommandPalette /> : null;
}
