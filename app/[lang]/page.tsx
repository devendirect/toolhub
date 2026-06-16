import type { Metadata } from "next";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { HomeClient } from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: `${BRAND_NAME} — ${BRAND_TAGLINE.en}`,
  description:
    "25 free tools, no signup. JSON formatter, Base64 encoder, UUID generator, QR codes, PDF converter, SEO analyzer and more. Most tools run 100% in your browser.",
  openGraph: {
    title: `${BRAND_NAME} — ${BRAND_TAGLINE.en}`,
    description: "25 free tools, no signup. Most tools run 100% in your browser.",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
