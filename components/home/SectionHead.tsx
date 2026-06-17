interface SectionHeadProps {
  label: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionHead({ label, action }: SectionHeadProps) {
  return (
    <div className="flex items-center gap-3 mb-[18px] text-[12px]">
      <h2 className="font-mono text-dim">{label}</h2>
      <span className="flex-1 h-px bg-line" />
      {action && <span>{action}</span>}
    </div>
  );
}
