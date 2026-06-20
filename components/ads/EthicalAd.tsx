"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window { ethicalads?: { load: () => void } }
}

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ETHICALADS_ID;

export function EthicalAd() {
  const pathname = usePathname();

  useEffect(() => {
    window.ethicalads?.load();
  }, [pathname]);

  if (!PUBLISHER_ID) return null;

  return (
    <div className="mb-10 flex justify-center">
      <div data-ea-publisher={PUBLISHER_ID} data-ea-type="image" className="ethical-ads" />
      <Script
        src="https://media.ethicalads.io/media/client/ethicalads.min.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
