import { type ReactNode } from "react";

interface OptionsBarProps {
  children: ReactNode;
  action?: ReactNode;
}

export function OptionsBar({ children, action }: OptionsBarProps) {
  return (
    <div className="flex items-center gap-6 px-[18px] py-[14px] border border-line bg-bg-1 border-b-0">
      {children}
      <div className="flex-1" />
      {action}
    </div>
  );
}

export function OptBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[10px] text-[12px]">
      <div className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">{label}</div>
      {children}
    </div>
  );
}

export function SegControl<T extends string | number>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  /** Libellé affiché par option (traduction) ; la valeur brute sinon */
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="flex border border-line-2 rounded-[3px] overflow-hidden">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3 py-1 font-mono text-[12px] border-r border-line-2 last:border-r-0 transition-colors duration-100 ${
            value === o ? "bg-brand-soft text-brand" : "text-fg-1 hover:bg-bg-2 hover:text-fg"
          }`}
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-block w-8 h-[18px] cursor-pointer">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute opacity-0"
      />
      <span
        className="absolute inset-0 rounded-[9px] transition-colors duration-150"
        style={{ background: on ? "var(--brand)" : "var(--line-2)" }}
      />
      <span
        className="absolute top-[2px] w-[14px] h-[14px] rounded-full transition-all duration-150"
        style={{ left: on ? "16px" : "2px", background: on ? "var(--bg)" : "var(--fg-1)" }}
      />
    </label>
  );
}
