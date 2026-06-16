import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { BRAND_NAME } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const indexing = process.env.INDEXING_ENABLED === "true";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { template: `%s — ${BRAND_NAME}`, default: BRAND_NAME },
  openGraph: { type: "website", siteName: BRAND_NAME },
  twitter: { card: "summary" },
  robots: { index: indexing, follow: indexing },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} dark`}
      data-accent="green"
      data-density="regular"
      data-font="geist"
    >
      <body className="bg-bg text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
