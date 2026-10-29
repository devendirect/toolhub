import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="font-mono text-[64px] text-brand leading-none mb-6 tracking-[0.1em]">404</div>
      <div className="font-mono text-[13px] text-dim mb-2">
        <span className="text-brand">$</span> {BRAND_NAME} -- page not found
      </div>
      <p className="text-[15px] text-fg-1 max-w-[40ch] mb-8">
        This page doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/en"
          className="px-[18px] py-[9px] bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:opacity-90 transition-opacity"
        >
          ← home
        </Link>
        <Link
          href="/en/tools"
          className="px-[18px] py-[9px] border border-line-2 bg-bg-1 font-mono text-[12px] text-fg-1 rounded-[3px] hover:border-brand-mid hover:text-fg transition-colors"
        >
          browse tools
        </Link>
      </div>
    </div>
  );
}
