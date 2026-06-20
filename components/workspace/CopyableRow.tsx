"use client";

interface Props {
  id: string;
  label: string;
  value: string;
  copied: string | null;
  onClick: () => void;
  extra?: React.ReactNode;
  lang: "fr" | "en";
  labelClass?: string;
  valueClass?: string;
}

export function CopyableRow({
  id, label, value, copied, onClick, extra, lang,
  labelClass = "w-16",
  valueClass = "text-[13px] text-fg",
}: Props) {
  return (
    <div
      className="group flex items-center gap-4 px-[14px] py-[11px] hover:bg-bg-2 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <span className={`font-mono text-[11px] text-dim uppercase tracking-[0.08em] shrink-0 ${labelClass}`}>{label}</span>
      {extra}
      <span className={`font-mono flex-1 break-all ${valueClass}`}>{value}</span>
      <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {copied === id ? "✓" : (lang === "fr" ? "copier" : "copy")}
      </span>
    </div>
  );
}
