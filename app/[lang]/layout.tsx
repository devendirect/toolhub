import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isValidLang } from "@/lib/localePath";
import { Providers } from "@/components/providers/Providers";
import { AppShell } from "@/components/layout/AppShell";

interface Props {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
