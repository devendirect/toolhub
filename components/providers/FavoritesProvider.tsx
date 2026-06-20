"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "utilisio-favorites";

interface FavoritesCtx {
  favorites: string[];
  toggle: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const Ctx = createContext<FavoritesCtx>({
  favorites: [],
  toggle: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = (slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  return <Ctx.Provider value={{ favorites, toggle, isFavorite }}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  return useContext(Ctx);
}
