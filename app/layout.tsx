import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { BRAND_NAME } from "@/lib/brand";
import { ADS_CLIENT } from "@/lib/ads";
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
        {/*
          Consent Mode v2 — les signaux par défaut doivent être posés AVANT tout
          script Google, d'où `beforeInteractive`. Tant que l'utilisateur n'a pas
          tranché, tout est `denied` : AdSense bascule alors en « limited ads »
          (annonces non personnalisées, sans cookie publicitaire) au lieu de ne
          rien diffuser. `wait_for_update` laisse 500 ms au choix pour arriver
          avant que les tags n'agissent sur les valeurs par défaut.
        */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
window.gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`}
        </Script>

        {/*
          Le tag AdSense est chargé sur toutes les pages, sans attendre la
          bannière. C'est la méthode documentée par Google : le consentement se
          pilote par Consent Mode, pas en empêchant le script de se charger. Le
          bloquer rendait le site inévaluable par le robot d'approbation AdSense,
          qui ne clique jamais sur une bannière de consentement.

          Balise <script> brute plutôt que next/script : React 19 la hisse dans le
          <head> et elle apparaît telle quelle dans la source HTML, donc détectable
          sans exécuter le moindre JavaScript. Avec next/script (afterInteractive)
          elle ne vivait que dans le payload RSC.

          Ordonnancement : ce tag est `async` et se trouve dans le <head>, donc en
          amont du script de consentement ci-dessus, qui est dans le <body>. Ce
          n'est pas un problème tant qu'aucune requête d'annonce n'est émise avant
          lui — et c'est le cas : les annonces ne partent que sur un
          `adsbygoogle.push({})`, déclenché par AdSlot dans un effet, donc après
          hydratation. ATTENTION : activer les « Auto ads » depuis l'interface
          AdSense romprait cette garantie, le tag émettant alors ses propres
          requêtes dès son chargement. Le cas échéant, il faudrait déplacer les
          signaux Consent Mode dans le <head>, avant ce tag.
        */}
        <script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
        />

        {children}
      </body>
    </html>
  );
}
