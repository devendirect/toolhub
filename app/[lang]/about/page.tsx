import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { AboutClient } from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: `Open-source credits — ${BRAND_NAME}`,
  description: `Libraries and tools used to build ${BRAND_NAME}. Crédits open-source.`,
};

export default function AboutPage() {
  return <AboutClient />;
}
