import { type ReactNode } from "react";

interface PaneProps {
  title: string;
  ext?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Pane({ title, ext, meta, actions, footer, children, className = "" }: PaneProps) {
  return (
    <div className={`flex flex-col bg-bg-1 ${className}`}>
      {/* Head */}
      <div className="flex items-center gap-[14px] px-[14px] py-[10px] border-b border-line bg-bg text-[12px]">
        <span className="font-mono">
          <span className="text-dim">// </span>
          <span className="text-fg">{title}</span>
          {ext && <span className="text-dim">.{ext}</span>}
        </span>
        {meta && <span className="font-mono text-[11px] text-dim">{meta}</span>}
        {actions && <div className="ml-auto flex gap-1">{actions}</div>}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          {footer}
        </div>
      )}
    </div>
  );
}

export function PaneBtn({ onClick, children, disabled }: { onClick?: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-[9px] py-[3px] font-mono text-[11px] text-fg-1 border border-line rounded-[3px] bg-bg-1 hover:text-brand hover:border-brand-mid transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
