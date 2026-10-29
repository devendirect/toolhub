import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BRAND_NAME } from "@/lib/brand";
import NotFound from "./[lang]/not-found";
import "./globals.css";

// URL sans route : le layout racine étant sous [lang], Next sert cette page
// directement, sans layout. Elle doit donc porter <html>, styles et polices.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `404 | ${BRAND_NAME}`,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      data-accent="green"
      data-density="regular"
      data-font="geist"
    >
      <body className="bg-bg text-fg antialiased">
        <NotFound />
      </body>
    </html>
  );
}
