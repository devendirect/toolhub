interface StatBlockProps {
  label: string;
  value: string;
  sublabel?: string;
}

export function StatBlock({ label, value, sublabel }: StatBlockProps) {
  return (
    <div className="p-[18px] border-r border-b border-line last:[border-right:none] [&:nth-last-child(-n+2)]:[border-bottom:none]">
      <div className="font-mono text-[10px] text-dim uppercase tracking-[0.1em]">{label}</div>
      <div className="font-mono text-[28px] font-medium tracking-[-0.02em] leading-[1.1] mt-1">{value}</div>
      {sublabel && <div className="font-mono text-[11px] text-dim mt-[2px]">{sublabel}</div>}
    </div>
  );
}
