"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLang } from "@/components/providers/I18nProvider";

export function useCopy() {
  const { lang } = useLang();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key?: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key ?? text);
    toast.success(lang === "fr" ? "Copié !" : "Copied!", { duration: 1200 });
    setTimeout(() => setCopied(null), 1500);
  };

  return { copy, copied };
}
